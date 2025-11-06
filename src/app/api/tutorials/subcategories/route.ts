import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { TutorialSubcategoryRepository } from "@data/repositories/impl/tutorial-subcategory.repository";
import { TutorialSubcategoryUseCase } from "@domain/usecases/tutorial-subcategory.usecase";

export const dynamic = 'force-dynamic';

const subRepo = new TutorialSubcategoryRepository();
const subUseCase = new TutorialSubcategoryUseCase(subRepo);

export async function GET() {
  try {
    const subcategories = await subUseCase.getAll();
    const data = subcategories.map((s) => s.toJSON());
    return NextResponse.json({ data, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { data: [], message: error.message, success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { message: "Unauthorized", success: false, data: null },
      { status: 401 }
    );
  }
  try {
    const body = await request.json();
    const created = await subUseCase.createSubcategory(body);
    return NextResponse.json({ data: created.toJSON(), success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}


