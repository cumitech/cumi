// src/domain/models/referral.model.ts

export interface IReferral {
  id: string;
  name: string;
  description: string;
  category: 'hosting' | 'tools' | 'finance' | 'marketing' | 'education' | 'other';
  company: string;
  referralUrl: string;
  originalUrl: string;
  discount?: string; // e.g., "20% off", "Free trial", "$50 credit"
  bonus?: string; // What you get as referrer
  imageUrl?: string;
  logoUrl?: string;
  features: string[];
  pros: string[];
  cons: string[];
  rating: number; // 1-5 stars
  priceRange: 'free' | 'budget' | 'mid-range' | 'premium';
  targetAudience: string[];
  useCase?: string;
  personalExperience?: string;
  isActive: boolean;
  isFeatured: boolean;
  priority: number; // For ordering
  clickCount: number;
  conversionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReferralClick {
  id: string;
  referralId: string;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  clickedAt: Date;
  converted: boolean;
  conversionValue?: number;
}

export interface IReferralStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  topPerformers: Array<{
    referralId: string;
    name: string;
    clicks: number;
    conversions: number;
    earnings: number;
  }>;
}

export const emptyReferral: IReferral = {
  id: "",
  name: "",
  description: "",
  category: "other",
  company: "",
  referralUrl: "",
  originalUrl: "",
  discount: "",
  bonus: "",
  imageUrl: "",
  logoUrl: "",
  features: [],
  pros: [],
  cons: [],
  rating: 0,
  priceRange: "free",
  targetAudience: [],
  useCase: "",
  personalExperience: "",
  isActive: true,
  isFeatured: false,
  priority: 0,
  clickCount: 0,
  conversionCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
