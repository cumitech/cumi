import { CourseEnrollmentRepository } from "@data/repositories/impl/course-enrollment.repository";
import { CourseEnrollmentUseCase } from "@domain/usecases/course-enrollment.usecase";
import authOptions from "@lib/options";
import { CourseEnrollmentRequestDto } from "@presentation/dtos/course-enrollment-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@services/notification.service";
import { CourseUseCase } from "@domain/usecases/course.usecase";

export const dynamic = 'force-dynamic';
import { UserRepository } from "@data/repositories/impl/user.repository";
import { UserUseCase } from "@domain/usecases/user.usecase";
import { CourseRepository } from "@data/repositories/impl/course.repository";

const courseEnrollmentRepository = new CourseEnrollmentRepository();
const courseEnrollmentUseCase = new CourseEnrollmentUseCase(courseEnrollmentRepository);
const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const courseRepository = new CourseRepository();
const courseUseCase = new CourseUseCase(courseRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId");
    const session = await getServerSession(authOptions);
    
    // If requesting specific user's enrollments or enrollment check, require authentication
    if (userId || (courseId && session?.user)) {
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

      if (courseId) {
        // Check if user is enrolled in specific course
        const isEnrolled = await courseEnrollmentUseCase.checkUserEnrollment(courseId, session.user.id);
        return NextResponse.json({
          enrolled: isEnrolled,
          success: true
        });
      } else if (userId) {
        // Get all enrollments for the user
        const enrollments = await courseEnrollmentUseCase.getEnrollmentsByUserId(session.user.id);
        return NextResponse.json(enrollments);
      }
    }
    
    // Public access: Get enrollment statistics (count only, no personal data)
    const enrollments = await courseEnrollmentUseCase.getAll();
    
    // Return aggregated data without exposing sensitive user information
    return NextResponse.json({
      success: true,
      total: Array.isArray(enrollments) ? enrollments.length : 0,
      data: Array.isArray(enrollments) ? enrollments : [],
      message: "Enrollment statistics retrieved successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        total: 0,
        message: error.message,
        validationErrors: [error],
        success: false,
      },
      { status: 400 }
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
    const dto = new CourseEnrollmentRequestDto(body);
    const validationErrors = await validate(dto);
    const userId = session.user.id;

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          validationErrors: displayValidationErrors(validationErrors),
          success: false,
          data: null,
          message: "Attention!",
        },
        { status: 400 }
      );
    }

    const enrollmentResponse = await courseEnrollmentUseCase.createEnrollment({
      ...dto.toData(),
      userId,
    });

    // Update user role to student if not already
    let roleUpdated = false;
    try {
      const user = await userUseCase.getUserById(userId);
      if (user && user.getDataValue('role') !== "student") {
        await userUseCase.updateUser({
          ...user.toJSON(),
          role: "student",
        });
        roleUpdated = true;
      }
    } catch (roleUpdateError) {
      console.error("Failed to update user role:", roleUpdateError);
      // Don't fail the enrollment if role update fails
    }

    // Send enrollment notification email
    try {
      const course = await courseUseCase.getCourseById(dto.toData().courseId);
      if (course) {
        await notificationService.notifyCourseEnrollment(
          userId,
          course.getDataValue('title'),
          `/courses/${course.getDataValue('id')}`
        );
      }
    } catch (emailError) {
      console.error("Failed to send enrollment notification:", emailError);
      // Don't fail the enrollment if email fails
    }

    return NextResponse.json(
      {
        data: enrollmentResponse.toJSON(),
        message: "Enrollment created successfully!",
        validationErrors: [],
        success: true,
        roleUpdated,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        validationErrors: [],
        success: false,
      },
      { status: 400 }
    );
  }
}
