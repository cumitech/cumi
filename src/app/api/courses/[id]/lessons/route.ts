import { LessonRepository } from "@data/repositories/impl/lesson.repository";
import { LessonUseCase } from "@domain/usecases/lesson.usecase";
import { LessonMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const lessonRepository = new LessonRepository();
const lessonUseCase = new LessonUseCase(lessonRepository);
const lessonMapper = new LessonMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: courseId } = params;
  try {

    const lessons = await lessonUseCase.getLessonsByCourseId(courseId);
    const lessonsDTO = lessonMapper.toDTOs(lessons);

    return NextResponse.json({
      data: lessonsDTO,
      success: true,
      message: "Lessons fetched successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch lessons",
        validationErrors: [],
        success: false,
      },
      { status: 500 }
    );
  }
}
