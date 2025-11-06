// src/data/repositories/referral.repository.ts

import { Knex } from "knex";
import { ReferralEntity } from "@data/entities/referral.entity";
import { ReferralClickEntity } from "@data/entities/referral-click.entity";

export class ReferralRepository {
  constructor(private db: Knex) {}

  async create(referral: ReferralEntity): Promise<ReferralEntity> {
    const [createdReferral] = await this.db('referrals')
      .insert(referral.toJSON())
      .returning('*');
    
    return ReferralEntity.fromJSON(createdReferral);
  }

  async findById(id: string): Promise<ReferralEntity | null> {
    const referral = await this.db('referrals')
      .where('id', id)
      .first();
    
    return referral ? ReferralEntity.fromJSON(referral) : null;
  }

  async findAll(filters?: {
    category?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ReferralEntity[]> {
    let query = this.db('referrals');

    if (filters?.category) {
      query = query.where('category', filters.category);
    }

    if (filters?.isActive !== undefined) {
      query = query.where('is_active', filters.isActive);
    }

    if (filters?.isFeatured !== undefined) {
      query = query.where('is_featured', filters.isFeatured);
    }

    query = query.orderBy('priority', 'asc').orderBy('created_at', 'desc');

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const referrals = await query;
    return referrals.map(referral => ReferralEntity.fromJSON(referral));
  }

  async update(id: string, referral: ReferralEntity): Promise<ReferralEntity | null> {
    const [updatedReferral] = await this.db('referrals')
      .where('id', id)
      .update(referral.toUpdateData())
      .returning('*');
    
    return updatedReferral ? ReferralEntity.fromJSON(updatedReferral) : null;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.db('referrals')
      .where('id', id)
      .del();
    
    return deletedCount > 0;
  }

  async incrementClickCount(id: string): Promise<void> {
    await this.db('referrals')
      .where('id', id)
      .increment('click_count', 1)
      .update('updated_at', new Date());
  }

  async incrementConversionCount(id: string): Promise<void> {
    await this.db('referrals')
      .where('id', id)
      .increment('conversion_count', 1)
      .update('updated_at', new Date());
  }

  async getStats(): Promise<{
    totalReferrals: number;
    activeReferrals: number;
    featuredReferrals: number;
    totalClicks: number;
    totalConversions: number;
  }> {
    const [totalReferrals] = await this.db('referrals').count('* as count');
    const [activeReferrals] = await this.db('referrals').where('is_active', true).count('* as count');
    const [featuredReferrals] = await this.db('referrals').where('is_featured', true).count('* as count');
    const [totalClicks] = await this.db('referrals').sum('click_count as total');
    const [totalConversions] = await this.db('referrals').sum('conversion_count as total');

    return {
      totalReferrals: parseInt(totalReferrals.count as string),
      activeReferrals: parseInt(activeReferrals.count as string),
      featuredReferrals: parseInt(featuredReferrals.count as string),
      totalClicks: parseInt(totalClicks.total as string) || 0,
      totalConversions: parseInt(totalConversions.total as string) || 0,
    };
  }
}

export class ReferralClickRepository {
  constructor(private db: Knex) {}

  async create(click: ReferralClickEntity): Promise<ReferralClickEntity> {
    const [createdClick] = await this.db('referral_clicks')
      .insert(click.toInsertData())
      .returning('*');
    
    return ReferralClickEntity.fromJSON(createdClick);
  }

  async findById(id: string): Promise<ReferralClickEntity | null> {
    const click = await this.db('referral_clicks')
      .where('id', id)
      .first();
    
    return click ? ReferralClickEntity.fromJSON(click) : null;
  }

  async findByReferralId(referralId: string, limit?: number): Promise<ReferralClickEntity[]> {
    let query = this.db('referral_clicks')
      .where('referral_id', referralId)
      .orderBy('clicked_at', 'desc');

    if (limit) {
      query = query.limit(limit);
    }

    const clicks = await query;
    return clicks.map(click => ReferralClickEntity.fromJSON(click));
  }

  async findByUserId(userId: string, limit?: number): Promise<ReferralClickEntity[]> {
    let query = this.db('referral_clicks')
      .where('user_id', userId)
      .orderBy('clicked_at', 'desc');

    if (limit) {
      query = query.limit(limit);
    }

    const clicks = await query;
    return clicks.map(click => ReferralClickEntity.fromJSON(click));
  }

  async getConversionStats(referralId?: string): Promise<{
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
  }> {
    let query = this.db('referral_clicks');

    if (referralId) {
      query = query.where('referral_id', referralId);
    }

    const [totalClicks] = await query.count('* as count');
    const [conversions] = await query.where('converted', true).count('* as count');

    const total = parseInt(totalClicks.count as string);
    const converted = parseInt(conversions.count as string);
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    return {
      totalClicks: total,
      totalConversions: converted,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }

  async markAsConverted(id: string, conversionValue?: number): Promise<ReferralClickEntity | null> {
    const updateData: any = { converted: true };
    if (conversionValue !== undefined) {
      updateData.conversion_value = conversionValue;
    }

    const [updatedClick] = await this.db('referral_clicks')
      .where('id', id)
      .update(updateData)
      .returning('*');
    
    return updatedClick ? ReferralClickEntity.fromJSON(updatedClick) : null;
  }
}
