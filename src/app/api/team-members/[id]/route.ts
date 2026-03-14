import { TeamMemberRepository } from "@data/repositories/impl/team-member.repository";
import { TeamMemberUseCase } from "@domain/usecases/team-member.usecase";
import authOptions from "@lib/options";
import { TeamMemberRequestDto } from "@presentation/dtos/team-member-request.dto";
import { TeamMemberMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const teamMemberRepository = new TeamMemberRepository();
const teamMemberUseCase = new TeamMemberUseCase(teamMemberRepository);
const teamMemberMapper = new TeamMemberMapper();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const member = await teamMemberUseCase.getById(id);
    if (!member) return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
    return NextResponse.json(member);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch", success: false },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }
  const { id } = await params;
  try {
    const existing = await teamMemberUseCase.getById(id);
    if (!existing) return NextResponse.json({ message: "Not found", success: false }, { status: 404 });
    const body = await request.json();
    const dto = new TeamMemberRequestDto(body);
    const validationErrors = await validate(dto);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed", validationErrors: displayValidationErrors(validationErrors), success: false },
        { status: 400 }
      );
    }
    const updated = await teamMemberUseCase.update(id, dto.toUpdateData(existing));
    return NextResponse.json({ data: updated, success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update", success: false },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }
  const { id } = await params;
  try {
    await teamMemberUseCase.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete", success: false },
      { status: 400 }
    );
  }
}
