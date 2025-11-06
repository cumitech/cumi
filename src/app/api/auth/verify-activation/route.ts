import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@data/repositories/impl/user.repository";
import { UserUseCase } from "@domain/usecases/user.usecase";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, userId } = body;

    if (!token || !userId) {
      return NextResponse.json(
        { message: "Missing required parameters", success: false },
        { status: 400 }
      );
    }

    // Get user and verify token
    const user = await userUseCase.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const userData = user.toJSON();
    
    // Check if token matches
    if (userData.emailVerificationToken !== token) {
      return NextResponse.json(
        { message: "Invalid or expired activation token", success: false },
        { status: 400 }
      );
    }

    // Clear the verification token
    await userUseCase.updateUser({
      ...userData,
      emailVerificationToken: null,
    });

    return NextResponse.json(
      {
        message: "Activation token verified successfully",
        success: true,
        data: { userId },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying activation token:", error);
    return NextResponse.json(
      { message: error.message || "Failed to verify activation token", success: false },
      { status: 500 }
    );
  }
}
