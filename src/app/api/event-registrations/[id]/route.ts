import { NextRequest, NextResponse } from "next/server";
import EventRegistrationUsecase from "@domain/usecases/event-registration.usecase";
import { EventRegistrationMapper } from "@presentation/mappers/event-registration.mapper";

const eventRegistrationUsecase = new EventRegistrationUsecase();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const eventRegistration = await eventRegistrationUsecase.getEventRegistrationById(id);

    if (!eventRegistration) {
      return NextResponse.json(
        { success: false, error: 'Event registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: EventRegistrationMapper.toDto(eventRegistration),
    });
  } catch (error) {
    console.error('Error fetching event registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event registration' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();

    const eventRegistration = await eventRegistrationUsecase.updateEventRegistration(id, body);

    if (!eventRegistration) {
      return NextResponse.json(
        { success: false, error: 'Event registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: EventRegistrationMapper.toDto(eventRegistration),
      message: 'Event registration updated successfully',
    });
  } catch (error) {
    console.error('Error updating event registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event registration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const success = await eventRegistrationUsecase.deleteEventRegistration(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Event registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event registration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event registration' },
      { status: 500 }
    );
  }
}
