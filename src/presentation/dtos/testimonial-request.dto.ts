import { ITestimonial } from "@domain/models/testimonial.model";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { nanoid } from "nanoid";

export class TestimonialRequestDto {
  @IsNotEmpty()
  @IsString()
  quote: string;

  @IsNotEmpty()
  @IsString()
  authorName: string;

  @IsOptional()
  @IsString()
  authorRole?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  order?: number;

  constructor(data: Partial<ITestimonial>) {
    this.quote = data.quote ?? "";
    this.authorName = data.authorName ?? "";
    this.authorRole = data.authorRole ?? undefined;
    this.order = data.order ?? 0;
  }

  toData(): Omit<ITestimonial, "id" | "createdAt" | "updatedAt"> {
    return {
      quote: this.quote,
      authorName: this.authorName,
      authorRole: this.authorRole ?? null,
      order: this.order ?? 0,
    };
  }

  toUpdateData(existing: ITestimonial): Partial<ITestimonial> {
    return {
      quote: this.quote,
      authorName: this.authorName,
      authorRole: this.authorRole ?? null,
      order: this.order ?? existing.order,
      updatedAt: new Date(),
    };
  }
}
