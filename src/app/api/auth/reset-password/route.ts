import { NextRequest, NextResponse } from "next/server";
import { UserUseCase } from "@domain/usecases/user.usecase";
import { UserRepository } from "@data/repositories/impl/user.repository";
import bcrypt from "bcryptjs";
import { emailService } from "@services/email.service";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { 
          error: "Missing Required Fields",
          message: "Both reset token and new password are required"
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { 
          error: "Weak Password",
          message: "Password must be at least 6 characters long"
        },
        { status: 400 }
      );
    }

    if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password)) {
      return NextResponse.json(
        { 
          error: "Weak Password",
          message: "Password must contain both letters and numbers"
        },
        { status: 400 }
      );
    }

    // Find user by reset token
    const user = await userUseCase.getUserByResetToken(token) as any;
    
    if (!user) {
      return NextResponse.json(
        { 
          error: "Invalid Reset Token",
          message: "The reset link is invalid or has already been used. Please request a new password reset."
        },
        { status: 400 }
      );
    }

    // Check if token is expired
    const tokenExpiry = user.resetTokenExpiry ? new Date(user.resetTokenExpiry) : null;
    if (!tokenExpiry || new Date() > tokenExpiry) {
      return NextResponse.json(
        { 
          error: "Expired Reset Token",
          message: "This password reset link has expired (valid for 1 hour). Please request a new one."
        },
        { status: 400 }
      );
    }

    // Get user data
    const userData = user.toJSON ? user.toJSON() : user;

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and clear reset token
    await userUseCase.updateUser({
      ...userData,
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      lastPasswordChange: new Date()
    } as any);

    // Send confirmation email (optional, non-blocking)
    try {
      const { html: emailHtml, attachments: emailAttachments } = emailService['getEmailTemplate']({
        title: 'Password Changed',
        subtitle: 'Your account security has been updated',
        content: `
          <h2>Hello ${userData.fullname || userData.username},</h2>
          <p>This is a confirmation that the password for your CUMI account <strong>${userData.email}</strong> has just been changed successfully.</p>
          
          <div class="success-box">
            <p><strong>✅ Your password was updated on:</strong><br>${new Date().toLocaleString()}</p>
          </div>
          
          <div class="warning-box">
            <p><strong>⚠️ Didn't make this change?</strong><br>If you did not request this password change, please contact our support team immediately at <a href="mailto:support@cumi.dev" style="color: #F59E0B;">support@cumi.dev</a></p>
          </div>
          
          <p>For your security, we recommend:</p>
          <div class="features-list">
            <ul>
              <li>Use a unique password for your CUMI account</li>
              <li>Enable two-factor authentication (coming soon)</li>
              <li>Never share your password with anyone</li>
              <li>Update your password regularly</li>
            </ul>
          </div>
        `
      });

      await emailService.sendEmail({
        to: { email: userData.email, name: userData.fullname || userData.username },
        subject: "Password Changed Successfully - CUMI",
        html: emailHtml,
        attachments: emailAttachments,
        text: `
Password Changed Successfully - CUMI

Hello ${userData.fullname || userData.username},

This is a confirmation that the password for your CUMI account ${userData.email} has been changed successfully.

Changed on: ${new Date().toLocaleString()}

If you did not make this change, please contact our support team immediately.

Best regards,
The CUMI Team
        `
      });
    } catch (emailError) {
      // Don't fail the password reset if email fails
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Password has been reset successfully. You can now sign in with your new password." 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: "An unexpected error occurred. Please try again later or contact support.",
        ...(process.env.NODE_ENV === 'development' && {
          details: error.message
        })
      },
      { status: 500 }
    );
  }
}

