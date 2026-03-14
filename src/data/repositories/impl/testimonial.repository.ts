import { ITestimonial } from "@domain/models/testimonial.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { Testimonial } from "../../entities/index";

export class TestimonialRepository {
  constructor() {}

  async create(data: ITestimonial): Promise<InstanceType<typeof Testimonial>> {
    try {
      return await Testimonial.create<InstanceType<typeof Testimonial>>(data as any);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Testimonial> | null> {
    try {
      return await Testimonial.findByPk<InstanceType<typeof Testimonial>>(id);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof Testimonial>[]> {
    try {
      return await Testimonial.findAll<InstanceType<typeof Testimonial>>({
        order: [["order", "ASC"], ["createdAt", "DESC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: Partial<ITestimonial>): Promise<InstanceType<typeof Testimonial> | null> {
    try {
      const existing = await Testimonial.findByPk<InstanceType<typeof Testimonial>>(id);
      if (!existing) throw new NotFoundException("Testimonial", id);
      await existing.update(data as any);
      return existing;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const row = await Testimonial.findByPk<InstanceType<typeof Testimonial>>(id);
      if (!row) throw new NotFoundException("Testimonial", id);
      await row.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
