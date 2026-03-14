import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { EventRegistration } from "@data/entities/index";
import { nanoid } from "nanoid";
import sequelize from "@database/db-sequelize.config";
import { verifyRecaptchaEnterprise } from "@lib/recaptcha";

export const dynamic = 'force-dynamic';

const RECAPTCHA_ACTION = "EVENT_REGISTRATION";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const verification = await verifyRecaptchaEnterprise(body.recaptchaToken, RECAPTCHA_ACTION);
    if (!verification.success) {
      return NextResponse.json(
        { message: verification.error || "reCAPTCHA verification failed", success: false, data: null },
        { status: 400 }
      );
    }
    const { recaptchaToken: _, recaptchaAction: __, ...rest } = body;
    const {
      eventId,
      userId,
      name,
      email,
      phone,
      company,
      dietaryRequirements,
      additionalNotes,
      paymentAmount = 0,
      paymentMethod
    } = rest;

    if (!eventId || !userId) {
      return NextResponse.json(
        {
          message: "Event ID and User ID are required",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          message: "Name, email, and phone number are required",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      where: { eventId, userId }
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          message: "User is already registered for this event",
          success: false,
          data: null,
        },
        { status: 409 }
      );
    }

    // Determine appropriate defaults based on event
    const event = await sequelize.models.Event.findByPk(eventId);
    const isFree = event?.getDataValue('isFree') || false;
    
    // Create new registration
    const registration = await EventRegistration.create({
      id: nanoid(20),
      eventId,
      userId,
      name,
      email,
      phone,
      company,
      dietaryRequirements,
      additionalNotes,
      status: 'pending', // Default to pending, admin will confirm
      paymentStatus: isFree ? 'paid' : 'pending', // Set based on event type
      paymentAmount: isFree ? 0 : paymentAmount,
      paymentMethod: isFree ? 'free' : paymentMethod,
      registrationDate: new Date(),
    });

    return NextResponse.json(
      {
        data: registration.toJSON(),
        message: "Successfully registered for event!",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        success: false,
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: [],
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const eventId = searchParams.get("eventId");

    // Require at least one filter parameter for security and performance
    if (!userId && !eventId) {
      console.warn('Event registration query missing required parameters');
      return NextResponse.json(
        {
          message: "Either userId or eventId parameter is required",
          success: true,
          data: [],
        },
        { status: 200 }
      );
    }

    let whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (eventId) whereClause.eventId = eventId;

    const registrations = await EventRegistration.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(
      {
        data: registrations.map(r => r.toJSON()),
        message: "Event registrations retrieved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching event registrations:', error);
    // Return empty array instead of error to prevent UI breaks
    return NextResponse.json(
      {
        data: [],
        message: error.message || "Failed to fetch registrations",
        success: false,
      },
      { status: 200 } // Changed from 400 to 200 to prevent breaking the UI
    );
  }
}
