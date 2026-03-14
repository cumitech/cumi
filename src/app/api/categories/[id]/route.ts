import { CategoryRepository } from "@data/repositories/impl/category.repository";
import { emptyCategory, ICategory } from "@domain/models/category";
import { CategoryUseCase } from "@domain/usecases/category.usecase";
import authOptions from "@lib/options";
import { CategoryRequestDto } from "@presentation/dtos/category-request.dto";
import { CategoryMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const categoryRepository = new CategoryRepository();
const categoryUseCase = new CategoryUseCase(categoryRepository);
const categoryMapper = new CategoryMapper();

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
    const dto = new CategoryRequestDto(await req.json());
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
    const obj: ICategory = {
      ...emptyCategory,
      ...dto.toData(),
      id: id,
    };
    const updatedCategory = await categoryUseCase.updateCategory(obj);
    const categoryDto = categoryMapper.toDTO(updatedCategory);

    return NextResponse.json(
      {
        data: categoryDto,
        message: "Category Updated Successfully!",
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

    const category = await categoryUseCase.getCategoryById(id);
    if (!category) {
      throw new NotFoundException("Category", id);
    }
    const categoryDTO = categoryMapper.toDTO(category);
    return NextResponse.json(categoryDTO);
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

    await categoryUseCase.deleteCategory(id);

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
