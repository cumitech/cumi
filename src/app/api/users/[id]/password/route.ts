import { UserRepository } from "@data/repositories/impl/user.repository";
import { UserUseCase } from "@domain/usecases/user.usecase";
import authOptions from "@lib/options";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false, data: null, validationErrors: [] },
        { status: 401 }
      );
    }

    // Users can only change their own password
    if (session.user.id !== id) {
      return NextResponse.json(
        { message: "Forbidden: You can only change your own password.", success: false, data: null, validationErrors: [] },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required", success: false, data: null, validationErrors: [] },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters long", success: false, data: null, validationErrors: [] },
        { status: 400 }
      );
    }

    // Get existing user data
    const existingUser = await userUseCase.getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", success: false, data: null, validationErrors: [] },
        { status: 404 }
      );
    }

    // Verify current password
    const userData = existingUser.toJSON();
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect", success: false, data: null, validationErrors: [] },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const updatedUserData = {
      ...userData,
      password: hashedNewPassword,
      lastPasswordChange: new Date(),
    };
    const updatedUser = await userUseCase.updateUser(updatedUserData);

    return NextResponse.json(
      {
        message: "Password changed successfully!",
        success: true,
        data: null,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to change password", success: false, data: null, validationErrors: [] },
      { status: 500 }
    );
  }
}
