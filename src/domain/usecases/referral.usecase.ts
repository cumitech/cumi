// src/domain/usecases/referral.usecase.ts

import { ReferralRepository, ReferralClickRepository } from "@data/repositories/impl/referral.repository";
import { ReferralRequestDto } from "@presentation/dtos/referral-request.dto";
import { ReferralClickRequestDto } from "@presentation/dtos/referral-click-request.dto";
import { IReferral, IReferralClick, IReferralStats } from "@domain/models/referral.model";

export class ReferralUseCase {
  constructor(
    private referralRepository: ReferralRepository,
    private referralClickRepository: ReferralClickRepository
  ) {}

  async createReferral(dto: ReferralRequestDto): Promise<any> {
    const referralData = dto.toInsertData();
    const createdReferral = await this.referralRepository.create(referralData);
    
    return createdReferral;
  }

  async getReferralById(id: string): Promise<any | null> {
    const referral = await this.referralRepository.findById(id);
    if (!referral) return null;

    return referral;
  }

  async getAllReferrals(filters?: {
    category?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const referrals = await this.referralRepository.getAll(filters);
    
    return referrals;
  }

  async updateReferral(id: string, dto: ReferralRequestDto): Promise<any | null> {
    const existingReferral = await this.referralRepository.findById(id);
    if (!existingReferral) return null;

    const updateData = dto.toUpdateData(existingReferral.toJSON());
    const updatedReferral = await this.referralRepository.update(id, updateData);

    if (!updatedReferral) return null;

    return updatedReferral;
  }

  async deleteReferral(id: string): Promise<boolean> {
    return await this.referralRepository.delete(id);
  }

  async trackClick(dto: ReferralClickRequestDto): Promise<IReferralClick> {
    // First, increment the click count on the referral
    await this.referralRepository.incrementClickCount(dto.referralId);

    // Then create the click record
    const clickData = dto.toInsertData();
    const createdClick = await this.referralClickRepository.create(clickData);

    return this.mapSequelizeClickToDomain(createdClick);
  }

  async getReferralStats(referralId?: string): Promise<IReferralStats> {
    const stats = await this.referralClickRepository.getConversionStats(referralId);
    
    // Get top performers if no specific referral ID
    let topPerformers: any[] = [];
    if (!referralId) {
      const referrals = await this.referralRepository.getAll({ limit: 10 });
      topPerformers = await Promise.all(
        referrals.map(async (referral: any) => {
          const clickStats = await this.referralClickRepository.getConversionStats(referral.id);
          return {
            referralId: referral.id,
            name: referral.name,
            clicks: referral.clickCount,
            conversions: referral.conversionCount,
            earnings: clickStats.totalConversions * 10, // Assuming $10 per conversion
          };
        })
      );
    }

    return {
      totalClicks: stats.totalClicks,
      totalConversions: stats.totalConversions,
      conversionRate: stats.conversionRate,
      totalEarnings: stats.totalConversions * 10, // Assuming $10 per conversion
      topPerformers,
    };
  }

  async markClickAsConverted(clickId: string, conversionValue?: number): Promise<IReferralClick | null> {
    const updatedClick = await this.referralClickRepository.markAsConverted(clickId, conversionValue);
    if (!updatedClick) return null;

    // Also increment the conversion count on the referral
    await this.referralRepository.incrementConversionCount((updatedClick as any).referralId);

    return this.mapSequelizeClickToDomain(updatedClick);
  }

  private mapSequelizeToDomain(referral: any): IReferral {
    return {
      id: referral.id,
      name: referral.name,
      description: referral.description,
      category: referral.category,
      company: referral.company,
      referralUrl: referral.referralUrl,
      originalUrl: referral.originalUrl,
      discount: referral.discount,
      bonus: referral.bonus,
      imageUrl: referral.imageUrl,
      logoUrl: referral.logoUrl,
      features: referral.features || [],
      pros: referral.pros || [],
      cons: referral.cons || [],
      rating: referral.rating,
      priceRange: referral.priceRange,
      targetAudience: referral.targetAudience || [],
      useCase: referral.useCase || '',
      personalExperience: referral.personalExperience || '',
      isActive: referral.isActive,
      isFeatured: referral.isFeatured,
      priority: referral.priority,
      clickCount: referral.clickCount,
      conversionCount: referral.conversionCount,
      createdAt: referral.createdAt,
      updatedAt: referral.updatedAt,
    };
  }

  private mapSequelizeClickToDomain(click: any): IReferralClick {
    return {
      id: click.id,
      referralId: click.referralId,
      userId: click.userId,
      sessionId: click.sessionId,
      ipAddress: click.ipAddress,
      userAgent: click.userAgent,
      referrer: click.referrer,
      clickedAt: click.clickedAt,
      converted: click.converted,
      conversionValue: click.conversionValue,
    };
  }
}