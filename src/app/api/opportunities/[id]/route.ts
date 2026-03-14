import { OpportunityRepository } from "@data/repositories/impl/opportunity.repository";
import {
  emptyOpportunity,
  IOpportunity,
} from "@domain/models/opportunity.model";
import { OpportunityUseCase } from "@domain/usecases/opportunity.usecase";
import authOptions from "@lib/options";
import { OpportunityRequestDto } from "@presentation/dtos/opportunity-request.dto";
import { OpportunityMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const opportunityRepository = new OpportunityRepository();
const opportunityUseCase = new OpportunityUseCase(opportunityRepository);
const opportunityMapper = new OpportunityMapper();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions); //get session info

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const dto = new OpportunityRequestDto(await req.json());
    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          validationErrors: displayValidationErrors(validationErrors) as any,
          success: false,
          data: null,
          message: "Attention!",
        },
        { status: 400 }
      );
    }

    const { id } = params;
    const obj: IOpportunity = {
      ...emptyOpportunity,
      ...dto.toData(),
      id: id,
    };
    const updatedOpportunity = await opportunityUseCase.updateOpportunity(obj);
    const opportunityDto = opportunityMapper.toDTO(updatedOpportunity);

    return NextResponse.json(
      {
        data: opportunityDto,
        message: "Opportunity Updated Successfully!",
        validationErrors: [],
        success: true,
      },
      { status: 200 }
    );
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const opportunity = await opportunityUseCase.getOpportunityById(id);
    if (!opportunity) {
      throw new NotFoundException("Opportunity", id);
    }
    const opportunityDTO = opportunityMapper.toDTO(opportunity);
    return NextResponse.json(opportunityDTO);
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await opportunityUseCase.deleteOpportunity(id);

    return NextResponse.json({
      message: `Operation successfully completed!`,
      validationErrors: [],
      success: true,
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        data: null,
        validationErrors: [error],
        success: true,
      },
      { status: 400 }
    );
  }
}
