// src/app/api/referrals/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { validate } from "class-validator";
import { ReferralRequestDto } from "@presentation/dtos/referral-request.dto";
import { ReferralUseCase } from "@domain/usecases/referral.usecase";
import { ReferralRepository, ReferralClickRepository } from "@data/repositories/impl/referral.repository";
import { ReferralMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { mapDatabaseToForm, normalizeReferralPayload } from "@utils/data-formatter";

// Initialize repositories and usecase
const referralRepository = new ReferralRepository();
const referralClickRepository = new ReferralClickRepository();
const referralUseCase = new ReferralUseCase(referralRepository, referralClickRepository);
const referralMapper = new ReferralMapper();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const referral = await referralUseCase.getReferralById(params.id);
    const data = referral.get({ plain: true });
    const formData = mapDatabaseToForm(data);
    console.log("formData: ", formData)
    if (!referral) {
      return NextResponse.json(
        {
          data: null,
          message: "Referral not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    // const referralDto = referralMapper.toDTO(formData);
    return NextResponse.json(formData);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null },
        { status: 401 }
      );
    }

    // Only admins can update referrals
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Only admins can update referrals.", success: false, data: null },
        { status: 403 }
      );
    }

    const body = await request.json();
    const normalized = normalizeReferralPayload(body);

    // Validate the request data
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

    const referral = await referralUseCase.updateReferral(params.id, dto);

    if (!referral) {
      return NextResponse.json(
        {
          data: null,
          message: "Referral not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null },
        { status: 401 }
      );
    }

    // Only admins can delete referrals
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Only admins can delete referrals.", success: false, data: null },
        { status: 403 }
      );
    }

    const deleted = await referralUseCase.deleteReferral(params.id);

    if (!deleted) {
      return NextResponse.json(
        {
          data: null,
          message: "Referral not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ deleted: true });
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

// Support PATCH updates in addition to PUT to avoid 405 from clients using PATCH
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Only admins can update referrals.", success: false, data: null },
        { status: 403 }
      );
    }

    const body = await request.json();
    const normalized = normalizeReferralPayload(body);

    // Validate the request data (allow partial but validate known fields)
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

    const referral = await referralUseCase.updateReferral(params.id, dto);
    if (!referral) {
      return NextResponse.json(
        {
          data: null,
          message: "Referral not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

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