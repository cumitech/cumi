import { ITutorialRepository } from "@data/repositories/contracts/repository.base";
import { ITutorial } from "@domain/models/tutorial.model";
import slugify from "slugify";
import { Tutorial } from "@data/entities/index";

export class TutorialUseCase {
  constructor(private readonly tutorialRepository: ITutorialRepository) {}

  async createTutorial(tutorial: ITutorial): Promise<InstanceType<typeof Tutorial>> {
    const existingTutorial = await this.tutorialRepository.findByTitle(tutorial.title);

    if (existingTutorial) {
      throw new Error("Tutorial already exists");
    }
    
    const slug = tutorial.slug || slugify(tutorial.title, { lower: true, replacement: "-" });
    return this.tutorialRepository.create({ ...tutorial, slug });
  }

  async getAll(): Promise<InstanceType<typeof Tutorial>[]> {
    return this.tutorialRepository.getAll();
  }

  async getPublishedTutorials(): Promise<InstanceType<typeof Tutorial>[]> {
    return this.tutorialRepository.findPublished();
  }

  async getTutorialById(id: string): Promise<InstanceType<typeof Tutorial> | null> {
    return this.tutorialRepository.findById(id);
  }

  async getTutorialBySlug(slug: string): Promise<InstanceType<typeof Tutorial> | null> {
    return this.tutorialRepository.findBySlug(slug);
  }

  async getTutorialsBySubcategory(
    subcategoryId: string
  ): Promise<InstanceType<typeof Tutorial>[] | null> {
    return this.tutorialRepository.findBySubcategory(subcategoryId);
  }

  async getTutorialsByAuthor(authorId: string): Promise<InstanceType<typeof Tutorial>[]> {
    const res = await this.tutorialRepository.findByAuthor(authorId);
    return res ?? [];
  }

  async updateTutorial(tutorial: ITutorial): Promise<InstanceType<typeof Tutorial>> {
    const obj: ITutorial = {
      ...tutorial,
      slug: tutorial.slug || slugify(tutorial.title, { lower: true, replacement: "-" }),
    };
    return this.tutorialRepository.update(obj);
  }

  async deleteTutorial(id: string): Promise<void> {
    return this.tutorialRepository.delete(id);
  }
}

