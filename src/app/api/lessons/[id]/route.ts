import { LessonRepository } from "@data/repositories/impl/lesson.repository";
import { LessonUseCase } from "@domain/usecases/lesson.usecase";
import authOptions from "@lib/options";
import { LessonRequestDto } from "@presentation/dtos/lesson-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const lessonRepository = new LessonRepository();
const lessonUseCase = new LessonUseCase(lessonRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const lesson = await lessonUseCase.getLessonById(id);

    if (!lesson) {
      return NextResponse.json(
        {
          data: null,
          message: "Lesson not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: lesson,
      message: "Lesson retrieved successfully",
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
    const dto = new LessonRequestDto(body);
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

    const existingLesson = await lessonUseCase.getLessonById(id);
    if (!existingLesson) {
      return NextResponse.json(
        {
          data: null,
          message: "Lesson not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const updatedLesson = await lessonUseCase.updateLesson({
      ...dto.toUpdateData(existingLesson as any),
      id: id,
    });

    return NextResponse.json({
      data: updatedLesson,
      message: "Lesson updated successfully",
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
    await lessonUseCase.deleteLesson(id);

    return NextResponse.json({
      data: null,
      message: "Lesson deleted successfully",
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