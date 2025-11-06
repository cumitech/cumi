// src/presentation/dtos/referral-click-request.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsUrl } from 'class-validator';

export class ReferralClickRequestDto {
  @IsString()
  @IsNotEmpty()
  referralId!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsNotEmpty()
  ipAddress!: string;

  @IsString()
  @IsNotEmpty()
  userAgent!: string;

  @IsOptional()
  @IsUrl()
  referrer?: string;

  @IsOptional()
  @IsBoolean()
  converted?: boolean;

  @IsOptional()
  @IsNumber()
  conversionValue?: number;

  toInsertData(): any {
    return {
      id: this.generateId(),
      referral_id: this.referralId,
      user_id: this.userId,
      session_id: this.sessionId,
      ip_address: this.ipAddress,
      user_agent: this.userAgent,
      referrer: this.referrer,
      clicked_at: new Date(),
      converted: this.converted ?? false,
      conversion_value: this.conversionValue
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
