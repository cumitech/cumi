import { ModuleRepository } from "@data/repositories/impl/module.repository";
import { ModuleUseCase } from "@domain/usecases/module.usecase";
import authOptions from "@lib/options";
import { ModuleRequestDto } from "@presentation/dtos/module-request.dto";
import { ModuleMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const moduleRepository = new ModuleRepository();
const moduleUseCase = new ModuleUseCase(moduleRepository);
const moduleMapper = new ModuleMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const moduleItem = await moduleUseCase.getModuleById(id);
    
    if (!moduleItem) {
      return NextResponse.json(
        {
          data: null,
          message: "Module not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }
    
    const moduleDTO = moduleMapper.toDTO(moduleItem);
    return NextResponse.json(moduleDTO);
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const dto = new ModuleRequestDto(await req.json());
    const validationErrors = await validate(dto);
    const userId = session.user.id;

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
    const updatedModule = await moduleUseCase.updateModule({
      ...dto.toData(),
      id: id,
      userId,
    });
    const moduleDto = moduleMapper.toDTO(updatedModule);

    return NextResponse.json(
      {
        data: moduleDto,
        message: "Module Updated Successfully!",
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await moduleUseCase.deleteModule(id);

    return NextResponse.json({
      message: `Module deleted successfully!`,
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
        success: false,
      },
      { status: 400 }
    );
  }
}
