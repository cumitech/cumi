import { AssignmentRepository } from "@data/repositories/impl/assignment.repository";
import { AssignmentUseCase } from "@domain/usecases/assignment.usecase";
import authOptions from "@lib/options";
import { AssignmentRequestDto } from "@presentation/dtos/assignment-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const assignmentRepository = new AssignmentRepository();
const assignmentUseCase = new AssignmentUseCase(assignmentRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const assignment = await assignmentUseCase.getAssignmentById(id);
    
    if (!assignment) {
      return NextResponse.json(
        {
          data: null,
          message: "Assignment not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: assignment,
      message: "Assignment retrieved successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
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
  const { id } = params;
  const session = await getServerSession(authOptions);

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
    const body = await request.json();
    const dto = new AssignmentRequestDto(body);
    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          validationErrors: displayValidationErrors(validationErrors),
          success: false,
          data: null,
          message: "Validation failed",
        },
        { status: 400 }
      );
    }

    const existingAssignment = await assignmentUseCase.getAssignmentById(id);
    if (!existingAssignment) {
      return NextResponse.json(
        {
          data: null,
          message: "Assignment not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const updatedAssignment = await assignmentUseCase.updateAssignment(
      dto.toUpdateData(existingAssignment.toJSON())
    );

    return NextResponse.json({
      data: updatedAssignment,
      message: "Assignment updated successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
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
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
      },
      { status: 401 }
    );
  }

  try {
    await assignmentUseCase.deleteAssignment(id);
    
    return NextResponse.json({
      data: null,
      message: "Assignment deleted successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        success: false,
      },
      { status: 400 }
    );
  }
}
