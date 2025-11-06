import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { TutorialRepository } from "@data/repositories/impl/tutorial.repository";
import { TutorialUseCase } from "@domain/usecases/tutorial.usecase";
import { NotFoundException } from "@shared/exceptions/not-found.exception";

const tutorialRepository = new TutorialRepository();
const tutorialUseCase = new TutorialUseCase(tutorialRepository);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const tutorial = await tutorialUseCase.getTutorialById(id);
    if (!tutorial) {
      throw new NotFoundException("Tutorial", id);
    }
    return NextResponse.json({ data: tutorial.toJSON(), success: true });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized", success: false, data: null },
      { status: 401 }
    );
  }
  try {
    const id = params.id;
    const body = await req.json();
    const updated = await tutorialUseCase.updateTutorial({ ...body, id });
    return NextResponse.json({ data: updated.toJSON(), success: true });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized", success: false, data: null },
      { status: 401 }
    );
  }
  try {
    const id = params.id;
    await tutorialUseCase.deleteTutorial(id);
    return NextResponse.json({ data: null, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}


