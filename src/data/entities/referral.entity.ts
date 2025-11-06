// src/data/entities/referral.entity.ts

import { BaseEntity } from "./base.entity";

export class ReferralEntity extends BaseEntity {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public category: 'hosting' | 'tools' | 'finance' | 'marketing' | 'education' | 'other',
    public company: string,
    public referralUrl: string,
    public originalUrl: string,
    public discount?: string,
    public bonus?: string,
    public imageUrl?: string,
    public logoUrl?: string,
    public features: string[] = [],
    public pros: string[] = [],
    public cons: string[] = [],
    public rating: number = 0,
    public priceRange: 'free' | 'budget' | 'mid-range' | 'premium' = 'free',
    public targetAudience: string[] = [],
    public useCase?: string,
    public personalExperience?: string,
    public isActive: boolean = true,
    public isFeatured: boolean = false,
    public priority: number = 0,
    public clickCount: number = 0,
    public conversionCount: number = 0,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    super();
  }

  static fromJSON(data: any): ReferralEntity {
    return new ReferralEntity(
      data.id,
      data.name,
      data.description,
      data.category,
      data.company,
      data.referral_url || data.referralUrl,
      data.original_url || data.originalUrl,
      data.discount,
      data.bonus,
      data.image_url || data.imageUrl,
      data.logo_url || data.logoUrl,
      Array.isArray(data.features) ? data.features : [],
      Array.isArray(data.pros) ? data.pros : [],
      Array.isArray(data.cons) ? data.cons : [],
      parseFloat(data.rating) || 0,
      data.price_range || data.priceRange,
      Array.isArray(data.target_audience) ? data.target_audience : [],
      data.use_case || data.useCase,
      data.personal_experience || data.personalExperience,
      Boolean(data.is_active !== undefined ? data.is_active : data.isActive),
      Boolean(data.is_featured !== undefined ? data.is_featured : data.isFeatured),
      parseInt(data.priority) || 0,
      parseInt(data.click_count) || 0,
      parseInt(data.conversion_count) || 0,
      data.created_at ? new Date(data.created_at) : new Date(),
      data.updated_at ? new Date(data.updated_at) : new Date()
    );
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      company: this.company,
      referral_url: this.referralUrl,
      original_url: this.originalUrl,
      discount: this.discount,
      bonus: this.bonus,
      image_url: this.imageUrl,
      logo_url: this.logoUrl,
      features: this.features,
      pros: this.pros,
      cons: this.cons,
      rating: this.rating,
      price_range: this.priceRange,
      target_audience: this.targetAudience,
      use_case: this.useCase,
      personal_experience: this.personalExperience,
      is_active: this.isActive,
      is_featured: this.isFeatured,
      priority: this.priority,
      click_count: this.clickCount,
      conversion_count: this.conversionCount,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  toUpdateData(): any {
    return {
      name: this.name,
      description: this.description,
      category: this.category,
      company: this.company,
      referral_url: this.referralUrl,
      original_url: this.originalUrl,
      discount: this.discount,
      bonus: this.bonus,
      image_url: this.imageUrl,
      logo_url: this.logoUrl,
      features: JSON.stringify(this.features),
      pros: JSON.stringify(this.pros),
      cons: JSON.stringify(this.cons),
      rating: this.rating,
      price_range: this.priceRange,
      target_audience: JSON.stringify(this.targetAudience),
      use_case: this.useCase,
      personal_experience: this.personalExperience,
      is_active: this.isActive,
      is_featured: this.isFeatured,
      priority: this.priority,
      updated_at: new Date()
    };
  }

  incrementClickCount(): void {
    this.clickCount += 1;
    this.updatedAt = new Date();
  }

  incrementConversionCount(): void {
    this.conversionCount += 1;
    this.updatedAt = new Date();
  }
}
