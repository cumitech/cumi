// src/app/api/referrals/[id]/click/route.ts

import { NextRequest, NextResponse } from "next/server";
import { validate } from "class-validator";
import { ReferralClickRequestDto } from "@presentation/dtos/referral-click-request.dto";
import { ReferralUseCase } from "@domain/usecases/referral.usecase";
import { ReferralRepository, ReferralClickRepository } from "@data/repositories/impl/referral.repository";
import { displayValidationErrors } from "@utils/displayValidationErrors";

// Initialize repositories and usecase
const referralRepository = new ReferralRepository();
const referralClickRepository = new ReferralClickRepository();
const referralUseCase = new ReferralUseCase(referralRepository, referralClickRepository);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, sessionId, referrer } = body;
    
    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate the request data
    const dto = new ReferralClickRequestDto();
    dto.referralId = params.id;
    dto.userId = userId;
    dto.sessionId = sessionId;
    dto.ipAddress = ipAddress;
    dto.userAgent = userAgent;
    dto.referrer = referrer;

    const validationErrors = await validate(dto);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          data: null,
          message: "Validation failed",
          validationErrors: displayValidationErrors(validationErrors),
          success: false,
        },
        { status: 400 }
      );
    }

    const click = await referralUseCase.trackClick(dto);
    
    // Since trackClick already returns IReferralClick (interface), we can return it directly
    // No need to use the mapper since it's already mapped from the usecase
    return NextResponse.json(click);
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
