import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { ITutorialRepository } from "../contracts/repository.base";
import { ITutorial } from "@domain/models/tutorial.model";
import { TutorialSubcategory, Tutorial, User } from "../../entities/index";

export class TutorialRepository implements ITutorialRepository {
  constructor() {}

  async findByTitle(title: string): Promise<InstanceType<typeof Tutorial> | null> {
    try {
      const tutorial = await Tutorial.findOne({
        where: { title },
        include: [
          {
            model: TutorialSubcategory,
            as: "Subcategory",
          },
          {
            model: User,
            as: "User",
          },
        ],
      });
      return tutorial;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Tutorial> | null> {
    try {
      const tutorial = await Tutorial.findOne({
        where: { slug },
        include: [
          {
            model: TutorialSubcategory,
            as: "Subcategory",
          },
          {
            model: User,
            as: "User",
          },
        ],
      });
      return tutorial;
    } catch (error) {
      throw error;
    }
  }

  async findBySubcategory(
    subcategoryId: string
  ): Promise<InstanceType<typeof Tutorial>[] | null> {
    try {
      const tutorials = await Tutorial.findAll({
        where: { 
          subcategoryId,
          status: 'PUBLISHED'
        },
        include: [
          {
            model: TutorialSubcategory,
            as: "Subcategory",
          },
          {
            model: User,
            as: "User",
          },
        ],
        order: [['publishedAt', 'DESC']],
      });
      return tutorials;
    } catch (error) {
      throw error;
    }
  }

  async findByAuthor(authorId: string): Promise<InstanceType<typeof Tutorial>[]> {
    try {
      const tutorials = await Tutorial.findAll({
        where: { authorId },
        include: [
          {
            model: TutorialSubcategory,
            as: "Subcategory",
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return tutorials;
    } catch (error) {
      throw error;
    }
  }

  async findPublished(): Promise<InstanceType<typeof Tutorial>[]> {
    try {
      const tutorials = await Tutorial.findAll({
        where: { status: 'PUBLISHED' },
        include: [
          {
            model: TutorialSubcategory,
            as: "Subcategory",
          },
          {
            model: User,
            as: "User",
          },
        ],
        order: [['publishedAt', 'DESC']],
      });
      return tutorials;
    } catch (error) {
      throw error;
    }
  }

  async create(tutorial: ITutorial): Promise<InstanceType<typeof Tutorial>> {
    try {
      return await Tutorial.create<InstanceType<typeof Tutorial>>({ ...tutorial });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Tutorial> | null> {
    try {
      const tutorial = await Tutorial.findByPk(id, {
        include: [
          {
            model: TutorialSubcategory,
            as: "Subcategory",
          },
          {
            model: User,
            as: "User",
          },
        ],
      });

      if (!tutorial) {
        throw new NotFoundException("Tutorial", id);
      }
      return tutorial;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof Tutorial>[]> {
    try {
      const tutorials = await Tutorial.findAll({
        include: [
          {
            model: TutorialSubcategory,
            as: "Subcategory",
          },
          {
            model: User,
            as: "User",
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return tutorials;
    } catch (error) {
      throw error;
    }
  }

  async update(tutorial: ITutorial): Promise<InstanceType<typeof Tutorial>> {
    const { id } = tutorial;
    try {
      const tutorialItem: any = await Tutorial.findByPk(id);

      if (!tutorialItem) {
        throw new NotFoundException("Tutorial", id?.toString() || "");
      }

      await tutorialItem.update({ ...tutorial });
      return tutorialItem;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const tutorialItem: any = await Tutorial.findByPk(id);

      if (!tutorialItem) {
        throw new NotFoundException("Tutorial", id);
      }

      await tutorialItem.destroy();
    } catch (error) {
      throw error;
    }
  }
}

