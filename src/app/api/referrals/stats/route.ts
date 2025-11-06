// src/app/api/referrals/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { ReferralUseCase } from "@domain/usecases/referral.usecase";
import { ReferralRepository, ReferralClickRepository } from "@data/repositories/impl/referral.repository";

// Initialize repositories and usecase
const referralRepository = new ReferralRepository();
const referralClickRepository = new ReferralClickRepository();
const referralUseCase = new ReferralUseCase(referralRepository, referralClickRepository);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null },
        { status: 401 }
      );
    }

    // Only admins can view stats
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Only admins can view referral stats.", success: false, data: null },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const referralId = searchParams.get('referralId');

    const stats = await referralUseCase.getReferralStats(referralId || undefined);

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      },
      { status: 400 }
    );
  }
}
