import { CommentRepository } from "@data/repositories/impl/comment.repository";
import { CommentUseCase } from "@domain/usecases/comment.usecase";
import authOptions from "@lib/options";
import { CommentRequestDto } from "@presentation/dtos/comment-request.dto";
import { CommentMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const commentRepository = new CommentRepository();
const commentUseCase = new CommentUseCase(commentRepository);
const commentMapper = new CommentMapper();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const comment = await commentUseCase.getCommentById(id);

    if (!comment) {
      return NextResponse.json(
        {
          data: null,
          message: "Comment not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: comment,
      message: "Comment fetched successfully",
      validationErrors: [],
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch comment",
        validationErrors: [],
        success: false,
      },
      { status: 500 }
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
    const dto = new CommentRequestDto(body);
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

    const comment = await commentUseCase.updateComment(id, dto, session.user.id);

    if (!comment) {
      return NextResponse.json(
        {
          data: null,
          message: "Comment not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: comment,
      message: "Comment updated successfully",
      validationErrors: [],
      success: true,
    });
  } catch (error: any) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to update comment",
        validationErrors: [],
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
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const deleted = await commentUseCase.deleteComment(id, session.user.id);

    if (!deleted) {
      return NextResponse.json(
        {
          data: null,
          message: "Comment not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: null,
      message: "Comment deleted successfully",
      validationErrors: [],
      success: true,
    });
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to delete comment",
        validationErrors: [],
        success: false,
      },
      { status: 400 }
    );
  }
}
