import { NextRequest, NextResponse } from "next/server";
import { TutorialRepository } from "@data/repositories/impl/tutorial.repository";
import { TutorialUseCase } from "@domain/usecases/tutorial.usecase";

const tutorialRepository = new TutorialRepository();
const tutorialUseCase = new TutorialUseCase(tutorialRepository);

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const tutorial = await tutorialUseCase.getTutorialBySlug(slug);
    if (!tutorial) {
      return NextResponse.json({ data: null, success: false }, { status: 404 });
    }
    return NextResponse.json({ data: tutorial.toJSON(), success: true });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}


