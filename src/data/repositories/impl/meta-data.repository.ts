import { IMetaDataRepository } from "../contracts/repository.base";
import { IMetaData } from "@domain/models/meta-data.model";
import { MetaData } from "../../entities";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";

export class MetaDataRepository implements IMetaDataRepository {
  /**
   * Initialize repository
   */
  constructor() {}

  /**
   * Receives a MetaData as parameter
   * @metaData
   * returns MetaData
   */
  async create(metaData: IMetaData): Promise<InstanceType<typeof MetaData>> {
    try {
      return await MetaData.create<InstanceType<typeof MetaData>>(metaData as any);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find or create meta data by page (atomic operation to prevent race conditions)
   * @metaData
   * returns MetaData
   */
  async findOrCreate(metaData: IMetaData): Promise<[InstanceType<typeof MetaData>, boolean]> {
    try {
      const [metaDataInstance, created] = await MetaData.findOrCreate({
        where: { page: metaData.page },
        defaults: metaData as any,
      });
      return [metaDataInstance as InstanceType<typeof MetaData>, created];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns MetaData
   */
  async findById(id: string): Promise<InstanceType<typeof MetaData> | null> {
    try {
      const metaDataItem = await MetaData.findByPk(id);

      if (!metaDataItem) {
        throw new NotFoundException("MetaData", id);
      }
      return metaDataItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of MetaData
   */
  async getAll(): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const metaDataList = await MetaData.findAll({
        order: [['updatedAt', 'DESC']],
      });
      return metaDataList;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a MetaData as parameter
   * @metaData
   * returns MetaData
   */
  async update(metaData: IMetaData): Promise<InstanceType<typeof MetaData>> {
    const { id } = metaData;
    try {
      const metaDataItem: any = await MetaData.findByPk(id);

      if (!metaDataItem) {
        throw new NotFoundException("MetaData", id.toString());
      }

      return await metaDataItem?.update({ ...metaData });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a string as parameter
   * @id
   * returns void
   */
  async delete(id: string): Promise<void> {
    try {
      const metaDataItem = await MetaData.findByPk(id);

      if (!metaDataItem) {
        throw new NotFoundException("MetaData", id);
      }

      await metaDataItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @page
   * returns MetaData
   */
  async findByPage(page: string): Promise<InstanceType<typeof MetaData> | null> {
    try {
      const metaData = await MetaData.findOne({
        where: { page },
      });
      return metaData;
    } catch (error) {
      throw error;
    }
  }

  async findBySchemaType(schemaType: string): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const metaDataList = await MetaData.findAll({
        where: { schemaType },
        order: [['updatedAt', 'DESC']],
      });
      return metaDataList;
    } catch (error) {
      throw error;
    }
  }

  async findByRobots(robots: string): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const metaDataList = await MetaData.findAll({
        where: { robots },
        order: [['updatedAt', 'DESC']],
      });
      return metaDataList;
    } catch (error) {
      throw error;
    }
  }

  async findByAuthor(author: string): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const metaDataList = await MetaData.findAll({
        where: { author },
        order: [['updatedAt', 'DESC']],
      });
      return metaDataList;
    } catch (error) {
      throw error;
    }
  }

  async searchMetaData(searchTerm: string): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const { Op } = require('sequelize');
      const metaDataList = await MetaData.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${searchTerm}%` } },
            { description: { [Op.iLike]: `%${searchTerm}%` } },
            { page: { [Op.iLike]: `%${searchTerm}%` } },
            { keywords: { [Op.iLike]: `%${searchTerm}%` } },
          ],
        },
        order: [['updatedAt', 'DESC']],
      });
      return metaDataList;
    } catch (error) {
      throw error;
    }
  }

  async findPublished(): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const metaDataList = await MetaData.findAll({
        where: {
          robots: {
            [require('sequelize').Op.like]: '%index%',
          },
        },
        order: [['updatedAt', 'DESC']],
      });
      return metaDataList;
    } catch (error) {
      throw error;
    }
  }

  async findRecent(limit: number = 10): Promise<InstanceType<typeof MetaData>[]> {
    try {
      const metaDataList = await MetaData.findAll({
        order: [['updatedAt', 'DESC']],
        limit,
      });
      return metaDataList;
    } catch (error) {
      throw error;
    }
  }
}
