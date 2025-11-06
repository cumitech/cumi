// src/presentation/dtos/referral-request.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsObject,
  IsUrl,
  Min,
  Max,
  IsInt,
  ValidateNested
} from 'class-validator';

export class ReferralRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(['hosting', 'tools', 'finance', 'marketing', 'education', 'other'])
  category!: string;

  @IsString()
  @IsNotEmpty()
  company!: string;

  @IsUrl()
  @IsNotEmpty()
  referralUrl!: string;

  @IsUrl()
  @IsNotEmpty()
  originalUrl!: string;

  @IsOptional()
  @IsString()
  discount?: string;

  @IsOptional()
  @IsString()
  bonus?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  // Changed to object with string values
  @IsOptional()
  @IsObject()
  features?: Record<string, string>;

  // Changed to object with string values
  @IsOptional()
  @IsObject()
  pros?: Record<string, string>;

  // Changed to object with string values
  @IsOptional()
  @IsObject()
  cons?: Record<string, string>;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating!: number;

  @IsEnum(['free', 'budget', 'mid-range', 'premium'])
  priceRange!: string;

  // Changed to object with boolean values
  @IsOptional()
  @IsObject()
  targetAudience?: Record<string, boolean>;

  @IsOptional()
  @IsString()
  useCase?: string;

  @IsOptional()
  @IsString()
  personalExperience?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;

  toInsertData(): any {
    return {
      id: this.generateId(),
      name: this.name,
      description: this.description,
      category: this.category,
      company: this.company,
      referralUrl: this.referralUrl,
      originalUrl: this.originalUrl,
      discount: this.discount,
      bonus: this.bonus,
      imageUrl: this.imageUrl,
      logoUrl: this.logoUrl,
      features: this.features || {},
      pros: this.pros || {},
      cons: this.cons || {},
      rating: this.rating,
      priceRange: this.priceRange,
      targetAudience: this.targetAudience || {},
      useCase: this.useCase,
      personalExperience: this.personalExperience,
      isActive: this.isActive ?? true,
      isFeatured: this.isFeatured ?? false,
      priority: this.priority ?? 0,
      clickCount: 0,
      conversionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  toUpdateData(existingData: any): any {
    return {
      name: this.name,
      description: this.description,
      category: this.category,
      company: this.company,
      referralUrl: this.referralUrl,
      originalUrl: this.originalUrl,
      discount: this.discount,
      bonus: this.bonus,
      imageUrl: this.imageUrl,
      logoUrl: this.logoUrl,
      features: this.features || {},
      pros: this.pros || {},
      cons: this.cons || {},
      rating: this.rating,
      priceRange: this.priceRange,
      targetAudience: this.targetAudience || {},
      useCase: this.useCase,
      personalExperience: this.personalExperience,
      isActive: this.isActive ?? existingData.isActive,
      isFeatured: this.isFeatured ?? existingData.isFeatured,
      priority: this.priority ?? existingData.priority,
      updatedAt: new Date()
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}