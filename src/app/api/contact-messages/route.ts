import { NextRequest, NextResponse } from "next/server";
import { ContactMessageUseCase } from "@domain/usecases/contact-message.usecase";
import { ContactMessageRepository } from "@data/repositories/impl/contact-message.repository";
import { contactMessageMapper } from "@presentation/mappers/contact-message.mapper";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { emailService } from "@services/email.service";

const contactMessageUseCase = new ContactMessageUseCase(new ContactMessageRepository());

export async function GET(request: NextRequest) {
  try {
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

    const messages = await contactMessageUseCase.getAll();
    const messagesMapped = contactMessageMapper.toDTOs(messages as any);
    
    return NextResponse.json(messagesMapped);
  } catch (error: any) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch contact messages",
        validationErrors: [],
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = await contactMessageUseCase.create(body);
    const messageDTO = contactMessageMapper.toDTO(message as any);

    // Send confirmation email to the person who submitted the contact message
    try {
      await emailService.sendNotificationEmail(
        body.email,
        body.name || 'Valued Customer',
        'Thank You for Contacting CUMI',
        `Thank you for reaching out to us! We have received your message regarding "${body.subject || 'your inquiry'}" and our team will get back to you within 24 hours. We appreciate your interest in our services and look forward to assisting you.`,
        `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/contact`
      );
    } catch (emailError) {
      console.error("Failed to send contact confirmation email:", emailError);
      // Don't fail the contact submission if email fails
    }

    // Send notification to admin about new contact message
    try {
      await emailService.sendNotificationEmail(
        process.env.ADMIN_EMAIL || 'admin@cumi.dev',
        'CUMI Admin',
        'New Contact Message Received',
        `A new contact message has been received from ${body.name} (${body.email}).\n\nSubject: ${body.subject || 'No subject'}\nMessage: ${body.message}\n\nPhone: ${body.phone || 'Not provided'}`,
        `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/contact-messages`
      );
    } catch (adminEmailError) {
      console.error("Failed to send admin notification email:", adminEmailError);
      // Don't fail the contact submission if admin email fails
    }

    return NextResponse.json(messageDTO, { status: 201 });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { error: "Failed to create contact message" },
      { status: 500 }
    );
  }
}

