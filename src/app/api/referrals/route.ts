// src/app/api/referrals/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { validate } from "class-validator";
import { ReferralRequestDto } from "@presentation/dtos/referral-request.dto";
import { ReferralUseCase } from "@domain/usecases/referral.usecase";
import { ReferralRepository, ReferralClickRepository } from "@data/repositories/impl/referral.repository";
import { ReferralMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { normalizeReferralPayload } from "@utils/data-formatter";
import { mapFormToDatabase } from "@utils/data-formatter";

// Initialize repositories and usecase
const referralRepository = new ReferralRepository();
const referralClickRepository = new ReferralClickRepository();
const referralUseCase = new ReferralUseCase(referralRepository, referralClickRepository);
const referralMapper = new ReferralMapper();

export async function GET(request: NextRequest) {
  try {
    // Public endpoint - no authentication required for reading referrals

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filters: any = {
      isActive: true,
      limit
    };

    if (category) {
      filters.category = category;
    }

    if (featured === 'true') {
      filters.isFeatured = true;
    }

    const referrals = await referralUseCase.getAllReferrals(filters);
    const referralsDto = referralMapper.toDTOs(referrals);

    return NextResponse.json({
      success: true,
      data: referralsDto,
      message: "Referrals fetched successfully"
    });
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null },
        { status: 401 }
      );
    }

    // Only admins can create referrals
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Only admins can create referrals.", success: false, data: null },
        { status: 403 }
      );
    }

    const body = await request.json();
    const normalized = normalizeReferralPayload(body);
    
    // Validate the request data using camelCase fields expected by the DTO
    const dto = new ReferralRequestDto();
    Object.assign(dto, normalized);
    
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

    // Create using DTO (usecase converts to DB shape internally)
    const referral = await referralUseCase.createReferral(dto);
    const referralDto = referralMapper.toDTO(referral);

    return NextResponse.json(referralDto);
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
