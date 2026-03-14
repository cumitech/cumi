import { TestimonialRepository } from "@data/repositories/impl/testimonial.repository";
import { TestimonialUseCase } from "@domain/usecases/testimonial.usecase";
import authOptions from "@lib/options";
import { TestimonialRequestDto } from "@presentation/dtos/testimonial-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const testimonialRepository = new TestimonialRepository();
const testimonialUseCase = new TestimonialUseCase(testimonialRepository);

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const item = await testimonialUseCase.getById(id);
    if (!item) {
      return NextResponse.json(
        { data: null, message: "Testimonial not found", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
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
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json(
      { data: null, message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const dto = new TestimonialRequestDto(body);
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
    const existing = await testimonialUseCase.getById(id);
    if (!existing) {
      return NextResponse.json(
        { data: null, message: "Testimonial not found", success: false },
        { status: 404 }
      );
    }
    const updated = await testimonialUseCase.update(id, dto.toUpdateData(existing));
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json(
      { data: null, message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    await testimonialUseCase.delete(id);
    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}
