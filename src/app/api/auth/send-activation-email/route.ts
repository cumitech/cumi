import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { emailService } from "@services/email.service";
import { UserRepository } from "@data/repositories/impl/user.repository";
import { UserUseCase } from "@domain/usecases/user.usecase";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to access this resource.", success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, email } = body;

    // Verify the user exists and get their details
    const user = await userUseCase.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Convert user model to plain object
    const userData = user.toJSON();

    // Generate activation token
    const activationToken = generateActivationToken();
    
    // Store activation token in user record (you might want to add this field to your user model)
    // For now, we'll use the existing emailVerificationToken field
    await userUseCase.updateUser({
      ...userData,
      emailVerificationToken: activationToken,
    });

    // Send activation email
    const activationLink = `${process.env.NEXTAUTH_URL}/auth/activate?token=${activationToken}&userId=${userId}`;
    
    await emailService.sendActivationEmail({
      to: email,
      userName: (userData as any).fullname || userData.username,
      activationLink,
    });

    return NextResponse.json(
      {
        message: "Activation email sent successfully!",
        success: true,
        data: { activationLink }, // For development purposes
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending activation email:", error);
    return NextResponse.json(
      { message: error.message || "Failed to send activation email", success: false },
      { status: 500 }
    );
  }
}

function generateActivationToken(): string {
  // Generate a secure random token
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
