import { RoleRepository } from "@data/repositories/impl/role.repository";
import { emptyRole, IRole } from "@domain/models/role.model";
import { RoleUseCase } from "@domain/usecases/role.usecase";
import authOptions from "@lib/options";
import { RoleRequestDto } from "@presentation/dtos/role-request.dto";
import { RoleMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const roleRepository = new RoleRepository();
const roleUseCase = new RoleUseCase(roleRepository);
const roleMapper = new RoleMapper();

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
    const dto = new RoleRequestDto(await req.json());
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
    const obj: IRole = {
      ...emptyRole,
      ...dto.toData(),
      id: id,
    };
    const updatedRole = await roleUseCase.updateRole(obj);
    const roleDto = roleMapper.toDTO(updatedRole);

    return NextResponse.json(
      {
        data: roleDto,
        message: "Role Updated Successfully!",
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

    const role = await roleUseCase.getRoleById(id);
    if (!role) {
      throw new NotFoundException("Role", id);
    }
    const roleDTO = roleMapper.toDTO(role);
    return NextResponse.json(roleDTO);
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

    await roleUseCase.deleteRole(id);

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
