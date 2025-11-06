// src/data/entities/referral-click.entity.ts

import { BaseEntity } from "./base.entity";

export class ReferralClickEntity extends BaseEntity {
  constructor(
    public id: string,
    public referralId: string,
    public sessionId: string,
    public ipAddress: string,
    public userAgent: string,
    public userId?: string,
    public referrer?: string,
    public clickedAt: Date = new Date(),
    public converted: boolean = false,
    public conversionValue?: number
  ) {
    super();
  }

  static fromJSON(data: any): ReferralClickEntity {
    return new ReferralClickEntity(
      data.id,
      data.referral_id || data.referralId,
      data.session_id || data.sessionId,
      data.ip_address || data.ipAddress,
      data.user_agent || data.userAgent,
      data.user_id || data.userId,
      data.referrer,
      data.clicked_at ? new Date(data.clicked_at) : new Date(),
      Boolean(data.converted),
      data.conversion_value ? parseFloat(data.conversion_value) : undefined
    );
  }

  toJSON(): any {
    return {
      id: this.id,
      referral_id: this.referralId,
      user_id: this.userId,
      session_id: this.sessionId,
      ip_address: this.ipAddress,
      user_agent: this.userAgent,
      referrer: this.referrer,
      clicked_at: this.clickedAt,
      converted: this.converted,
      conversion_value: this.conversionValue
    };
  }

  toInsertData(): any {
    return {
      id: this.id,
      referral_id: this.referralId,
      user_id: this.userId,
      session_id: this.sessionId,
      ip_address: this.ipAddress,
      user_agent: this.userAgent,
      referrer: this.referrer,
      clicked_at: this.clickedAt,
      converted: this.converted,
      conversion_value: this.conversionValue
    };
  }

  markAsConverted(conversionValue?: number): void {
    this.converted = true;
    if (conversionValue !== undefined) {
      this.conversionValue = conversionValue;
    }
  }
}
