import { ITestimonial } from "@domain/models/testimonial.model";
import { TestimonialRepository } from "@data/repositories/impl/testimonial.repository";

export class TestimonialUseCase {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async getAll(): Promise<ITestimonial[]> {
    const list = await this.testimonialRepository.getAll();
    return list.map((t: any) => t.dataValues || t.get?.() || t);
  }

  async getById(id: string): Promise<ITestimonial | null> {
    const row = await this.testimonialRepository.findById(id);
    return row ? (row as any).dataValues || row.get?.() : null;
  }

  async create(data: Omit<ITestimonial, "id" | "createdAt" | "updatedAt">): Promise<ITestimonial> {
    const created = await this.testimonialRepository.create(data as ITestimonial);
    return (created as any).dataValues || created;
  }

  async update(id: string, data: Partial<ITestimonial>): Promise<ITestimonial | null> {
    const updated = await this.testimonialRepository.update(id, data);
    return updated ? (updated as any).dataValues || updated : null;
  }

  async delete(id: string): Promise<boolean> {
    return await this.testimonialRepository.delete(id);
  }
}
