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

export async function GET() {
  try {
    const list = await teamMemberRepository.getAll();
    const dtos = teamMemberMapper.toDTOs(list);
    return NextResponse.json(dtos);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch team members", success: false },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  try {
    const body = await request.json();
    const dto = new TeamMemberRequestDto(body);
    const validationErrors = await validate(dto);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed", validationErrors: displayValidationErrors(validationErrors), success: false },
        { status: 400 }
      );
    }
    const created = await teamMemberUseCase.create(dto.toData());
    return NextResponse.json({ data: created, message: "Team member created", success: true }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create", success: false },
      { status: 400 }
    );
  }
}
