import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { TutorialSubcategoryRepository } from "@data/repositories/impl/tutorial-subcategory.repository";
import { TutorialSubcategoryUseCase } from "@domain/usecases/tutorial-subcategory.usecase";

const subRepo = new TutorialSubcategoryRepository();
const subUseCase = new TutorialSubcategoryUseCase(subRepo);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sub = await subUseCase.getSubcategoryById(id);
    if (!sub) {
      return NextResponse.json({ data: null, success: false }, { status: 404 });
    }
    return NextResponse.json({ data: sub.toJSON(), success: true });
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
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { message: "Unauthorized", success: false, data: null },
      { status: 401 }
    );
  }
  try {
    const id = params.id;
    const body = await req.json();
    const updated = await subUseCase.updateSubcategory({ ...body, id });
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
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { message: "Unauthorized", success: false, data: null },
      { status: 401 }
    );
  }
  try {
    const id = params.id;
    await subUseCase.deleteSubcategory(id);
    return NextResponse.json({ data: null, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}


