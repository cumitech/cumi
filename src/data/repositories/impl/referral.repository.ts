// src/data/repositories/impl/referral.repository.ts
import { Referral, ReferralClick } from "@data/entities/index";
import { IReferral } from "@domain/models/referral.model";
import { NotFoundException } from "@shared/exceptions/not-found.exception";

export class ReferralRepository {
  constructor() {}

  async create(referral: IReferral): Promise<InstanceType<typeof Referral>> {
    try {
      return await Referral.create<InstanceType<typeof Referral>>({ ...referral });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Referral> | null> {
    try {
      return await Referral.findByPk<InstanceType<typeof Referral>>(id);
    } catch (error) {
      throw error;
    }
  }

  async getAll(filters?: {
    category?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<InstanceType<typeof Referral>[]> {
    try {
      const whereClause: any = {};
      
      if (filters?.category) {
        whereClause.category = filters.category;
      }
      
      if (filters?.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }
      
      if (filters?.isFeatured !== undefined) {
        whereClause.isFeatured = filters.isFeatured;
      }

      const options: any = {
        where: whereClause,
        order: [['priority', 'ASC'], ['created_at', 'DESC']],
      };

      if (filters?.limit) {
        options.limit = filters.limit;
      }

      if (filters?.offset) {
        options.offset = filters.offset;
      }

      return await Referral.findAll<InstanceType<typeof Referral>>(options);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, referral: Partial<IReferral>): Promise<InstanceType<typeof Referral> | null> {
    try {
      const existingReferral = await Referral.findByPk<InstanceType<typeof Referral>>(id);
      if (!existingReferral) {
        throw new NotFoundException("Referral", id);
      }
      await existingReferral.update({ ...referral });
      return existingReferral;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const referral = await Referral.findByPk<InstanceType<typeof Referral>>(id);
      if (!referral) {
        throw new NotFoundException("Referral", id);
      }
      await referral.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async incrementClickCount(id: string): Promise<void> {
    try {
      const referral = await Referral.findByPk<InstanceType<typeof Referral>>(id);
      if (referral) {
        await referral.increment('clickCount');
      }
    } catch (error) {
      throw error;
    }
  }

  async incrementConversionCount(id: string): Promise<void> {
    try {
      const referral = await Referral.findByPk<InstanceType<typeof Referral>>(id);
      if (referral) {
        await referral.increment('conversionCount');
      }
    } catch (error) {
      throw error;
    }
  }

  async getStats(): Promise<{
    totalReferrals: number;
    activeReferrals: number;
    featuredReferrals: number;
    totalClicks: number;
    totalConversions: number;
  }> {
    try {
      const [totalReferrals, activeReferrals, featuredReferrals] = await Promise.all([
        Referral.count(),
        Referral.count({ where: { isActive: true } }),
        Referral.count({ where: { isFeatured: true } }),
      ]);

      const [totalClicks, totalConversions] = await Promise.all([
        Referral.sum('clickCount') || 0,
        Referral.sum('conversionCount') || 0,
      ]);

      return {
        totalReferrals,
        activeReferrals,
        featuredReferrals,
        totalClicks: totalClicks as number,
        totalConversions: totalConversions as number,
      };
    } catch (error) {
      throw error;
    }
  }
}

export class ReferralClickRepository {
  constructor() {}

  async create(click: any): Promise<InstanceType<typeof ReferralClick>> {
    try {
      return await ReferralClick.create<InstanceType<typeof ReferralClick>>({ ...click });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof ReferralClick> | null> {
    try {
      return await ReferralClick.findByPk<InstanceType<typeof ReferralClick>>(id);
    } catch (error) {
      throw error;
    }
  }

  async findByReferralId(referralId: string, limit?: number): Promise<InstanceType<typeof ReferralClick>[]> {
    try {
      const options: any = {
        where: { referralId },
        order: [['clicked_at', 'DESC']],
      };

      if (limit) {
        options.limit = limit;
      }

      return await ReferralClick.findAll<InstanceType<typeof ReferralClick>>(options);
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string, limit?: number): Promise<InstanceType<typeof ReferralClick>[]> {
    try {
      const options: any = {
        where: { userId },
        order: [['clicked_at', 'DESC']],
      };

      if (limit) {
        options.limit = limit;
      }

      return await ReferralClick.findAll<InstanceType<typeof ReferralClick>>(options);
    } catch (error) {
      throw error;
    }
  }

  async getConversionStats(referralId?: string): Promise<{
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
  }> {
    try {
      const whereClause: any = {};
      if (referralId) {
        whereClause.referralId = referralId;
      }

      const [totalClicks, conversions] = await Promise.all([
        ReferralClick.count({ where: whereClause }),
        ReferralClick.count({ where: { ...whereClause, converted: true } }),
      ]);

      const conversionRate = totalClicks > 0 ? (conversions / totalClicks) * 100 : 0;

      return {
        totalClicks,
        totalConversions: conversions,
        conversionRate: Math.round(conversionRate * 100) / 100,
      };
    } catch (error) {
      throw error;
    }
  }

  async markAsConverted(id: string, conversionValue?: number): Promise<InstanceType<typeof ReferralClick> | null> {
    try {
      const click = await ReferralClick.findByPk<InstanceType<typeof ReferralClick>>(id);
      if (!click) {
        return null;
      }

      const updateData: any = { converted: true };
      if (conversionValue !== undefined) {
        updateData.conversionValue = conversionValue;
      }

      await click.update(updateData);
      return click;
    } catch (error) {
      throw error;
    }
  }
}
