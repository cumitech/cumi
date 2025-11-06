import { ITutorialSubcategoryRepository } from "@data/repositories/contracts/repository.base";
import { ITutorialSubcategory } from "@domain/models/tutorial-subcategory.model";
import slugify from "slugify";
import { TutorialSubcategory } from "@data/entities/index";

export class TutorialSubcategoryUseCase {
  constructor(private readonly tutorialSubcategoryRepository: ITutorialSubcategoryRepository) {}

  async createSubcategory(subcategory: ITutorialSubcategory): Promise<InstanceType<typeof TutorialSubcategory>> {
    const existingSubcategory = await this.tutorialSubcategoryRepository.findByName(subcategory.name);

    if (existingSubcategory) {
      throw new Error("Tutorial subcategory already exists");
    }

    const slug = subcategory.slug || slugify(subcategory.name, { lower: true, replacement: "-" });
    return this.tutorialSubcategoryRepository.create({ ...subcategory, slug });
  }

  async getAll(): Promise<InstanceType<typeof TutorialSubcategory>[]> {
    return this.tutorialSubcategoryRepository.getAll();
  }

  async getSubcategoryById(id: string): Promise<InstanceType<typeof TutorialSubcategory> | null> {
    return this.tutorialSubcategoryRepository.findById(id);
  }

  async getSubcategoryBySlug(slug: string): Promise<InstanceType<typeof TutorialSubcategory> | null> {
    return this.tutorialSubcategoryRepository.findBySlug(slug);
  }

  async updateSubcategory(subcategory: ITutorialSubcategory): Promise<InstanceType<typeof TutorialSubcategory>> {
    const obj: ITutorialSubcategory = {
      ...subcategory,
      slug: subcategory.slug || slugify(subcategory.name, { lower: true, replacement: "-" }),
    };
    return this.tutorialSubcategoryRepository.update(obj);
  }

  async deleteSubcategory(id: string): Promise<void> {
    return this.tutorialSubcategoryRepository.delete(id);
  }
}

