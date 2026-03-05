import { NextRequest, NextResponse } from "next/server";
import { UserUseCase } from "@domain/usecases/user.usecase";
import { UserRepository } from "@data/repositories/impl/user.repository";
import { emailService } from "@services/email.service";
import { nanoid } from "nanoid";
import { SITE_URL } from "@constants/api-url";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await userUseCase.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: "If the email exists, a password reset link has been sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = nanoid(32);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    const resetUrl = `${SITE_URL}/auth/reset-password?token=${resetToken}`;

    // Get user data
    const userData = user.toJSON ? user.toJSON() : user;

    // Update user with reset token - only pass necessary fields
    await userUseCase.updateUser({
      id: userData.id,
      email: userData.email,
      username: userData.username,
      fullname: userData.fullname,
      password: userData.password,
      resetToken,
      resetTokenExpiry
    } as any);

    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail(
      userData.email,
      userData.fullName || userData.username,
      resetToken
    ).catch((emailError) => {
      console.error("Email service error:", emailError);
      return null;
    });

    return NextResponse.json(
      { 
        message: "Password reset link has been sent to your email",
        ...(process.env.NODE_ENV === 'development' && {
          resetToken,
          resetUrl,
          emailSent: !!emailSent,
          note: 'Development mode: Copy the reset URL above'
        })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in password reset:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to process password reset",
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.stack : String(error)
        })
      },
      { status: 500 }
    );
  }
}
