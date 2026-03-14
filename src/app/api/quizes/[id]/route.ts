import { QuizRepository } from "@data/repositories/impl/quiz.repository";
import { QuizUseCase } from "@domain/usecases/quiz.usecase";
import authOptions from "@lib/options";
import { QuizRequestDto } from "@presentation/dtos/quiz-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const quizRepository = new QuizRepository();
const quizUseCase = new QuizUseCase(quizRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const quiz = await quizUseCase.getQuizById(id);
    
    if (!quiz) {
      return NextResponse.json(
        {
          data: null,
          message: "Quiz not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: quiz,
      message: "Quiz retrieved successfully",
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
    const dto = new QuizRequestDto(body);
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

    const existingQuiz = await quizUseCase.getQuizById(id);
    if (!existingQuiz) {
      return NextResponse.json(
        {
          data: null,
          message: "Quiz not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const updatedQuiz = await quizUseCase.updateQuiz(
      dto.toUpdateData(existingQuiz.toJSON())
    );

    return NextResponse.json({
      data: updatedQuiz,
      message: "Quiz updated successfully",
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
    await quizUseCase.deleteQuiz(id);
    
    return NextResponse.json({
      data: null,
      message: "Quiz deleted successfully",
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