import { NextRequest, NextResponse } from "next/server";
import { SubscribeUseCase } from "@domain/usecases/subscribe.usecase";
import { SubscribeRepository } from "@data/repositories/subscribe.repository";
import { subscribeMapper } from "@presentation/mappers/subscribe.mapper";
import { emailService } from "@services/email.service";

const subscribeUseCase = new SubscribeUseCase(new SubscribeRepository());

export async function GET(request: NextRequest) {
  try {
    const subscribes = await subscribeUseCase.getAll();
    const subscribesMapped = subscribeMapper.toDTOs(subscribes as any);
    return NextResponse.json(subscribesMapped);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if email already exists
    const existingSubscriber = await subscribeUseCase.findByEmail(body.email);
    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 }
      );
    }

    const subscribe = await subscribeUseCase.create(body);
    const subscribeDTO = subscribeMapper.toDTO(subscribe as any);

    // Send subscription confirmation email
    try {
      await emailService.sendNotificationEmail(
        body.email,
        body.name || 'Subscriber',
        'Welcome to CUMI Newsletter!',
        `Thank you for subscribing to our newsletter! You'll now receive updates about our latest courses, events, and educational content. We're excited to have you as part of our learning community.`,
        `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`
      );
    } catch (emailError) {
      console.error("Failed to send subscription confirmation email:", emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json(subscribeDTO, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

