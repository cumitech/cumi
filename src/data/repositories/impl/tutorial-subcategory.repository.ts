import { ITutorialSubcategory } from "@domain/models/tutorial-subcategory.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { ITutorialSubcategoryRepository } from "../contracts/repository.base";
import { TutorialSubcategory, Tutorial } from "../../entities/index";

export class TutorialSubcategoryRepository implements ITutorialSubcategoryRepository {
  constructor() {}

  async create(subcategory: ITutorialSubcategory): Promise<InstanceType<typeof TutorialSubcategory>> {
    try {
      return await TutorialSubcategory.create<InstanceType<typeof TutorialSubcategory>>({ ...subcategory });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof TutorialSubcategory> | null> {
    try {
      const subcategory = await TutorialSubcategory.findByPk(id, {
        include: [
          {
            model: Tutorial,
            as: "tutorials",
          },
        ],
      });

      if (!subcategory) {
        throw new NotFoundException("TutorialSubcategory", id);
      }
      return subcategory;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof TutorialSubcategory> | null> {
    try {
      const subcategory = await TutorialSubcategory.findOne({
        where: { slug },
        include: [
          {
            model: Tutorial,
            as: "tutorials",
          },
        ],
      });
      return subcategory;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<InstanceType<typeof TutorialSubcategory> | null> {
    try {
      const subcategory = await TutorialSubcategory.findOne({
        where: { name },
      });
      return subcategory;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof TutorialSubcategory>[]> {
    try {
      const subcategories = await TutorialSubcategory.findAll({
        include: [
          {
            model: Tutorial,
            as: "tutorials",
          },
        ],
        order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      });
      return subcategories;
    } catch (error) {
      throw error;
    }
  }

  async update(subcategory: ITutorialSubcategory): Promise<InstanceType<typeof TutorialSubcategory>> {
    const { id } = subcategory;
    try {
      const subcategoryItem: any = await TutorialSubcategory.findByPk(id);

      if (!subcategoryItem) {
        throw new NotFoundException("TutorialSubcategory", id?.toString() || "");
      }

      await subcategoryItem.update({ ...subcategory });
      return subcategoryItem;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const subcategoryItem: any = await TutorialSubcategory.findByPk(id);

      if (!subcategoryItem) {
        throw new NotFoundException("TutorialSubcategory", id);
      }

      await subcategoryItem.destroy();
    } catch (error) {
      throw error;
    }
  }
}

