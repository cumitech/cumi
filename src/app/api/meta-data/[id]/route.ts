// src/app/api/meta-data/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { validate } from "class-validator";
import { MetaDataRequestDto } from "@presentation/dtos/meta-data-request.dto";
import { MetaDataUseCase } from "@domain/usecases/meta-data.usecase";
import { MetaDataRepository } from "@data/repositories/impl/meta-data.repository";
import { MetaDataMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";

// Initialize repository, usecase, and mapper
const metaDataRepository = new MetaDataRepository();
const metaDataUseCase = new MetaDataUseCase(metaDataRepository);
const metaDataMapper = new MetaDataMapper();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { 
          message: "Unauthorized: Please log in as admin to access this resource.",
          success: false,
          data: null
        },
        { status: 401 }
      );
    }

    const { id } = params;
    const metaData = await metaDataUseCase.getMetaDataById(id);

    if (!metaData) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Meta data not found',
          data: null
        },
        { status: 404 }
      );
    }

    const metaDataDto = metaDataMapper.toDTO(metaData);

    return NextResponse.json({
      data: metaDataDto,
      message: "Meta data fetched successfully",
      validationErrors: [],
      success: true,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { 
          message: "Unauthorized: Please log in to access this resource.",
          success: false,
          data: null
        },
        { status: 401 }
      );
    }

    // Only admins can update meta data
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { 
          message: "Forbidden: Only admins can update meta data.", 
          success: false, 
          data: null 
        },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    
    // Validate the request data
    const dto = new MetaDataRequestDto({ ...body, id });
    
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

    const metaData = await metaDataUseCase.updateMetaData(dto.toData());
    const metaDataDto = metaDataMapper.toDTO(metaData);

    return NextResponse.json({
      data: metaDataDto,
      message: "Meta data updated successfully!",
      validationErrors: [],
      success: true,
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

// Support PATCH updates (same behavior as PUT)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { 
          message: "Unauthorized: Please log in to access this resource.",
          success: false,
          data: null
        },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { 
          message: "Forbidden: Only admins can update meta data.", 
          success: false, 
          data: null 
        },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    const dto = new MetaDataRequestDto({ ...body, id });
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

    const metaData = await metaDataUseCase.updateMetaData(dto.toData());
    const metaDataDto = metaDataMapper.toDTO(metaData);

    return NextResponse.json({
      data: metaDataDto,
      message: "Meta data updated successfully!",
      validationErrors: [],
      success: true,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { 
          message: "Unauthorized: Please log in to access this resource.",
          success: false,
          data: null
        },
        { status: 401 }
      );
    }

    // Only admins can delete meta data
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { 
          message: "Forbidden: Only admins can delete meta data.", 
          success: false, 
          data: null 
        },
        { status: 403 }
      );
    }

    const { id } = params;
    
    await metaDataUseCase.deleteMetaData(id);

    return NextResponse.json({
      success: true,
      message: 'Meta data deleted successfully',
      data: null,
      validationErrors: []
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
