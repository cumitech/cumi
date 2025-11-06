import { UserRepository } from "@data/repositories/impl/user.repository";
import { UserUseCase } from "@domain/usecases/user.usecase";
import authOptions from "@lib/options";
import { UserRequestDto } from "@presentation/dtos/user-request.dto";
import { UserMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const userMapper = new UserMapper();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null, validationErrors: [] },
        { status: 401 }
      );
    }

    // Users can only access their own data unless they're admin
    if (session.user.id !== params.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: You can only access your own data.", success: false, data: null, validationErrors: [] },
        { status: 403 }
      );
    }

    const user = await userUseCase.getUserById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false, data: null, validationErrors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(userMapper.toDTO(user));
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch user", success: false, data: null, validationErrors: [] },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null, validationErrors: [] },
        { status: 401 }
      );
    }

    // Users can only update their own data unless they're admin
    if (session.user.id !== params.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: You can only update your own data.", success: false, data: null, validationErrors: [] },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Get existing user data
    const existingUser = await userUseCase.getUserById(params.id);
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false, data: null, validationErrors: [] },
        { status: 404 }
      );
    }

    const userItem = existingUser.toJSON();
    
    // For partial updates, merge existing data with new updates
    const updatedData = {
      ...userItem,
      ...body,
      // Don't allow changing password through this endpoint
      password: userItem.password,
    };

    // Create DTO with merged data
    const dto = new UserRequestDto(updatedData);

    // Skip validation for partial updates to avoid required field errors
    // Only validate if we're doing a full update (has all required fields)
    const hasAllRequiredFields = body.username && body.email && body.fullName;
    
    if (hasAllRequiredFields) {
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
    }

    const updatedUser = await userUseCase.updateUser(dto.toUpdateData(updatedData));

    return NextResponse.json(
      {
        data: userMapper.toDTO(updatedUser),
        message: "User updated successfully!",
        validationErrors: [],
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update user", success: false, data: null, validationErrors: [] },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null, validationErrors: [] },
        { status: 401 }
      );
    }

    // Only admins can delete users
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Only admins can delete users.", success: false, data: null, validationErrors: [] },
        { status: 403 }
      );
    }

    await userUseCase.deleteUser(params.id);

    return NextResponse.json(
      { message: "User deleted successfully!", success: true, data: null, validationErrors: [] },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete user", success: false, data: null, validationErrors: [] },
      { status: 500 }
    );
  }
}