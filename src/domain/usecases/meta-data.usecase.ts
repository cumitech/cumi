import { MetaData } from "@data/entities/index";
import { IMetaDataRepository } from "@data/repositories/contracts/repository.base";
import { IMetaData } from "@domain/models/meta-data.model";
import { nanoid } from "nanoid";

export class MetaDataUseCase {
  /**
   *
   */
  constructor(private readonly metaDataRepository: IMetaDataRepository) {}

  async createMetaData(metaData: IMetaData): Promise<InstanceType<typeof MetaData>> {
    const existingMetaData = await this.metaDataRepository.findByPage(metaData.page);

    if (existingMetaData) {
      throw new Error("MetaData for this page already exists");
    }

    // Assign a unique ID
    const metaDataWithId: IMetaData = {
      ...metaData,
      id: nanoid(),
    };

    return this.metaDataRepository.create(metaDataWithId);
  }

  async getAll(): Promise<InstanceType<typeof MetaData>[]> {
    return this.metaDataRepository.getAll();
  }

  async getMetaDataById(id: string): Promise<InstanceType<typeof MetaData> | null> {
    try {
      return await this.metaDataRepository.findById(id);
    } catch (error: any) {
      return null;
    }
  }

  async getMetaDataByPage(page: string): Promise<InstanceType<typeof MetaData> | null> {
    return this.metaDataRepository.findByPage(page);
  }

  async getMetaDataBySchemaType(schemaType: string): Promise<InstanceType<typeof MetaData>[]> {
    return this.metaDataRepository.findBySchemaType(schemaType);
  }

  async getMetaDataByRobots(robots: string): Promise<InstanceType<typeof MetaData>[]> {
    return this.metaDataRepository.findByRobots(robots);
  }

  async getMetaDataByAuthor(author: string): Promise<InstanceType<typeof MetaData>[]> {
    return this.metaDataRepository.findByAuthor(author);
  }

  async searchMetaData(searchTerm: string): Promise<InstanceType<typeof MetaData>[]> {
    return this.metaDataRepository.searchMetaData(searchTerm);
  }

  async getPublishedMetaData(): Promise<InstanceType<typeof MetaData>[]> {
    return this.metaDataRepository.findPublished();
  }

  async getRecentMetaData(limit: number = 10): Promise<InstanceType<typeof MetaData>[]> {
    return this.metaDataRepository.findRecent(limit);
  }

  async updateMetaData(metaData: IMetaData): Promise<InstanceType<typeof MetaData>> {
    const obj: IMetaData = {
      ...metaData,
    };
    return this.metaDataRepository.update(obj);
  }

  async deleteMetaData(id: string): Promise<void> {
    return this.metaDataRepository.delete(id);
  }

  async upsertMetaData(metaData: IMetaData): Promise<InstanceType<typeof MetaData>> {
    // First try to find existing
    const existingMetaData = await this.metaDataRepository.findByPage(metaData.page);
    
    if (existingMetaData) {
      // Update existing record
      const existingData = existingMetaData.toJSON();
      const updatedMetaData: IMetaData = {
        ...metaData,
        id: existingData.id,
        createdAt: existingData.createdAt,
        updatedAt: new Date(),
      };
      return this.metaDataRepository.update(updatedMetaData);
    }
    
    // Use findOrCreate to handle race conditions atomically
    const [metaDataInstance] = await this.metaDataRepository.findOrCreate({
      ...metaData,
      id: metaData.id || nanoid(),
    });
    
    return metaDataInstance;
  }
}

