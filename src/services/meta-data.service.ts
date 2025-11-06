import { MetaDataRepository } from "@data/repositories/impl/meta-data.repository";
import { MetaDataUseCase } from "@domain/usecases/meta-data.usecase";
import { IMetaData } from "@domain/models/meta-data.model";
import { MetaData } from "@data/entities";
import { APP_URL } from "@constants/api-url";
import { nanoid } from "nanoid";

class MetaDataService {
  private useCase: MetaDataUseCase;

  constructor() {
    const repository = new MetaDataRepository();
    this.useCase = new MetaDataUseCase(repository);
  }

  /**
   * Get meta data for a specific page
   */
  async getPageMetaData(pagePath: string): Promise<InstanceType<typeof MetaData> | null> {
    try {
      const metaData = await this.useCase.getMetaDataByPage(pagePath);
      return metaData;
    } catch (error) {
      console.error('Error fetching page meta data:', error);
      return null;
    }
  }

  /**
   * Get all meta data for admin dashboard
   */
  async getAllMetaData(): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const metaDataList = await this.useCase.getAll();
      return metaDataList;
    } catch (error) {
      console.error('Error fetching all meta data:', error);
      return [];
    }
  }

  /**
   * Create or update meta data for a page
   */
  async saveMetaData(metaData: IMetaData): Promise<InstanceType<typeof MetaData> | null> {
    try {
      return await this.useCase.upsertMetaData(metaData);
    } catch (error) {
      console.error('Error saving meta data:', error);
      return null;
    }
  }

  /**
   * Delete meta data for a page
   */
  async deleteMetaData(id: string): Promise<boolean> {
    try {
      await this.useCase.deleteMetaData(id);
      return true;
    } catch (error) {
      console.error('Error deleting meta data:', error);
      return false;
    }
  }

  /**
   * Search meta data
   */
  async searchMetaData(searchTerm: string): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const results = await this.useCase.searchMetaData(searchTerm);
      return results;
    } catch (error) {
      console.error('Error searching meta data:', error);
      return [];
    }
  }

  /**
   * Get meta data by schema type
   */
  async getMetaDataBySchemaType(schemaType: string): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const results = await this.useCase.getMetaDataBySchemaType(schemaType);
      return results;
    } catch (error) {
      console.error('Error fetching meta data by schema type:', error);
      return [];
    }
  }

  /**
   * Get meta data by robots directive
   */
  async getMetaDataByRobots(robots: string): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const results = await this.useCase.getMetaDataByRobots(robots);
      return results;
    } catch (error) {
      console.error('Error fetching meta data by robots:', error);
      return [];
    }
  }

  /**
   * Get recent meta data
   */
  async getRecentMetaData(limit: number = 10): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const results = await this.useCase.getRecentMetaData(limit);
      return results;
    } catch (error) {
      console.error('Error fetching recent meta data:', error);
      return [];
    }
  }

  /**
   * Generate default meta data for a page if none exists
   */
  generateDefaultMetaData(pagePath: string, title?: string, description?: string): IMetaData {
    const baseUrl = APP_URL;
    
    return {
      id: nanoid(), // Generate a proper ID instead of empty string
      page: pagePath,
      title: title || `${pagePath.charAt(1).toUpperCase() + pagePath.slice(2)} - CUMI`,
      description: description || `Learn more about ${pagePath.charAt(1).toUpperCase() + pagePath.slice(2)} on CUMI, a leading software development company.`,
      keywords: ['cumi', 'software development', 'web development', 'mobile apps'],
      canonical: `${baseUrl}${pagePath}`,
      ogTitle: title || `${pagePath.charAt(1).toUpperCase() + pagePath.slice(2)} - CUMI`,
      ogDescription: description || `Learn more about ${pagePath.charAt(1).toUpperCase() + pagePath.slice(2)} on CUMI.`,
      ogImage: `${baseUrl}/uploads/media/default-og-image.jpg`,
      ogUrl: `${baseUrl}${pagePath}`,
      ogType: 'website',
      twitterTitle: title || `${pagePath.charAt(1).toUpperCase() + pagePath.slice(2)} - CUMI`,
      twitterDescription: description || `Learn more about ${pagePath.charAt(1).toUpperCase() + pagePath.slice(2)} on CUMI.`,
      twitterImage: `${baseUrl}/uploads/media/default-twitter-image.jpg`,
      twitterCard: 'summary_large_image',
      schemaType: 'WebPage',
      robots: 'index, follow',
      author: 'CUMI Team',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get or create meta data for a page (fallback to default if not found)
   */
  async getOrCreateMetaData(pagePath: string, title?: string, description?: string): Promise<InstanceType<typeof MetaData> | IMetaData> {
    try {
      // First, try to get existing meta data
      const existingMetaData = await this.getPageMetaData(pagePath);
      
      if (existingMetaData) {
        return existingMetaData;
      }

      // Create default meta data if none exists
      const defaultMetaData = this.generateDefaultMetaData(pagePath, title, description);
      const savedMetaData = await this.saveMetaData(defaultMetaData);
      
      return savedMetaData || defaultMetaData;
    } catch (error: any) {
      // If we get a unique constraint error, it means another process created the record
      // In that case, fetch it and return it
      if (error?.parent?.code === 'ER_DUP_ENTRY' || error?.name === 'SequelizeUniqueConstraintError') {
        try {
          const existingMetaData = await this.getPageMetaData(pagePath);
          if (existingMetaData) {
            return existingMetaData;
          }
        } catch (fetchError) {
          console.error('Error fetching existing meta data after duplicate error:', fetchError);
        }
      }
      
      console.error('Error getting or creating meta data:', error);
      return this.generateDefaultMetaData(pagePath, title, description);
    }
  }
}

export const metaDataService = new MetaDataService();
export default metaDataService;
