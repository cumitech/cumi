import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { TutorialRepository } from "@data/repositories/impl/tutorial.repository";
import { TutorialUseCase } from "@domain/usecases/tutorial.usecase";

export const dynamic = 'force-dynamic';

const tutorialRepository = new TutorialRepository();
const tutorialUseCase = new TutorialUseCase(tutorialRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTitle = searchParams.get("searchTitle");
    const sortBy = searchParams.get("sortBy");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const authorId = searchParams.get("authorId");
    const subcategoryId = searchParams.get("subcategoryId");

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    let tutorials = isAdmin
      ? await tutorialUseCase.getAll()
      : await tutorialUseCase.getPublishedTutorials();

    // toJSON and filter in memory for simplicity (optimize later with queries if needed)
    let list = tutorials.map((t) => t.toJSON());

    if (authorId) {
      list = list.filter((t: any) => t.authorId === authorId);
    }
    if (subcategoryId) {
      list = list.filter((t: any) => t.subcategoryId === subcategoryId);
    }
    if (searchTitle) {
      const q = searchTitle.toLowerCase();
      list = list.filter(
        (t: any) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }
    if (sortBy) {
      list = [...list].sort((a: any, b: any) => {
        switch (sortBy) {
          case "date":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "title":
            return (a.title || '').localeCompare(b.title || '');
          case "author":
            return (a.authorName || '').localeCompare(b.authorName || '');
          default:
            return 0;
        }
      });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const total = list.length;
    const data = list.slice(start, end);

    return NextResponse.json({ data, total, page, limit, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { data: [], message: error.message, success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized", success: false, data: null },
      { status: 401 }
    );
  }
  try {
    const body = await request.json();
    const userId = session.user.id;
    const created = await tutorialUseCase.createTutorial({
      ...body,
      authorId: userId,
    });
    return NextResponse.json(
      { data: created.toJSON(), message: "Tutorial created", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message, success: false },
      { status: 400 }
    );
  }
}

