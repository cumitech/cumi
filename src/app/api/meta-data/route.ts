// src/app/api/meta-data/route.ts

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

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const schemaType = searchParams.get('schemaType');
    const robots = searchParams.get('robots');
    const author = searchParams.get('author');
    const search = searchParams.get('search');
    const _start = searchParams.get('_start');
    const _end = searchParams.get('_end');
    const _sort = searchParams.get('_sort');
    const _order = searchParams.get('_order');

    let data: any[] = [];

    // Handle different query types
    if (page) {
      const metaData = await metaDataUseCase.getMetaDataByPage(page);
      data = metaData ? [metaDataMapper.toDTO(metaData)] : [];
    } else if (schemaType) {
      const metaDataList = await metaDataUseCase.getMetaDataBySchemaType(schemaType);
      data = metaDataMapper.toDTOs(metaDataList);
    } else if (robots) {
      const metaDataList = await metaDataUseCase.getMetaDataByRobots(robots);
      data = metaDataMapper.toDTOs(metaDataList);
    } else if (author) {
      const metaDataList = await metaDataUseCase.getMetaDataByAuthor(author);
      data = metaDataMapper.toDTOs(metaDataList);
    } else if (search) {
      const metaDataList = await metaDataUseCase.searchMetaData(search);
      data = metaDataMapper.toDTOs(metaDataList);
    } else {
      const metaDataList = await metaDataUseCase.getAll();
      data = metaDataMapper.toDTOs(metaDataList);
    }

    // Handle pagination
    const start = _start ? parseInt(_start) : 0;
    const end = _end ? parseInt(_end) : data.length;
    const paginatedData = data.slice(start, end);

    // Handle sorting
    if (_sort && _order) {
      paginatedData.sort((a, b) => {
        const aValue = a[_sort];
        const bValue = b[_sort];
        
        if (_order === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    return NextResponse.json(paginatedData);
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
        { 
          message: "Unauthorized: Please log in to access this resource.", 
          success: false, 
          data: null 
        },
        { status: 401 }
      );
    }

    // Only admins can create meta data
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { 
          message: "Forbidden: Only admins can create meta data.", 
          success: false, 
          data: null 
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate the request data
    const dto = new MetaDataRequestDto(body);
    
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

    const metaData = await metaDataUseCase.upsertMetaData(dto.toData());
    const metaDataDto = metaDataMapper.toDTO(metaData);

    return NextResponse.json({
      data: metaDataDto,
      message: "Meta data saved successfully!",
      validationErrors: [],
      success: true,
    }, { status: 201 });
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
