import { CommentRepository } from "@data/repositories/impl/comment.repository";
import { CommentUseCase } from "@domain/usecases/comment.usecase";
import authOptions from "@lib/options";
import { CommentRequestDto } from "@presentation/dtos/comment-request.dto";
import { CommentMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const commentRepository = new CommentRepository();
const commentUseCase = new CommentUseCase(commentRepository);
const commentMapper = new CommentMapper();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");
    const recent = searchParams.get("recent");
    const limit = parseInt(searchParams.get("limit") || "10");

    let comments;
    if (postId) {
      comments = await commentUseCase.getCommentsByPostId(postId);
    } else if (userId) {
      comments = await commentUseCase.getCommentsByUserId(userId);
    } else if (recent === "true") {
      comments = await commentUseCase.getRecentComments(limit);
    } else {
      return NextResponse.json(
        {
          data: null,
          message: "Invalid query parameters",
          validationErrors: [],
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: comments,
      message: "Comments fetched successfully",
      validationErrors: [],
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    
    // If it's a table doesn't exist error, return empty array instead of error
    if (error.message && error.message.includes("doesn't exist")) {
      return NextResponse.json({
        data: [],
        message: "Comments table not initialized yet",
        validationErrors: [],
        success: true,
      });
    }
    
    return NextResponse.json(
      {
        data: [],
        message: "Comments feature coming soon",
        validationErrors: [],
        success: true,
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const userId = session.user.id;

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

    const comment = await commentUseCase.createComment(dto.toData(), userId);

    // Try to fetch the created comment with user information, but don't fail if it doesn't work
    let createdComment = comment;
    try {
      const fetchedComment = await commentUseCase.getCommentById(comment.id);
      if (fetchedComment) createdComment = fetchedComment;
    } catch (fetchError) {
      console.warn("Could not fetch comment with user info:", fetchError);
      // Use the original comment if fetching fails
    }

    return NextResponse.json(
      {
        data: createdComment,
        message: "Comment created successfully!",
        validationErrors: [],
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating comment:", error);
    
    // If it's a table doesn't exist error, return a friendly message
    if (error.message && error.message.includes("doesn't exist")) {
      return NextResponse.json(
        {
          data: null,
          message: "Comments feature is not available yet. Please try again later.",
          validationErrors: [],
          success: false,
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to create comment",
        validationErrors: [],
        success: false,
      },
      { status: 400 }
    );
  }
}
