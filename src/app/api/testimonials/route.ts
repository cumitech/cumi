import { TestimonialRepository } from "@data/repositories/impl/testimonial.repository";
import { TestimonialUseCase } from "@domain/usecases/testimonial.usecase";
import authOptions from "@lib/options";
import { TestimonialRequestDto } from "@presentation/dtos/testimonial-request.dto";
import { TestimonialMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const testimonialRepository = new TestimonialRepository();
const testimonialUseCase = new TestimonialUseCase(testimonialRepository);
const testimonialMapper = new TestimonialMapper();

export async function GET() {
  try {
    const list = await testimonialUseCase.getAll();
    const dtos = testimonialMapper.toDTOs(list as any);
    return NextResponse.json(dtos);
  } catch (error: any) {
    return NextResponse.json(
      { data: [], message: error.message, success: false },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const data = dto.toData();
    const created = await testimonialUseCase.create(data);
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}
