import { NextRequest, NextResponse } from "next/server";
import { TeamUseCase } from "@domain/usecases/team.usecase";
import { TeamRepository } from "@data/repositories/team.repository";
import { teamMapper } from "@presentation/mappers/team.mapper";

const teamUseCase = new TeamUseCase(new TeamRepository());

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idParam } = params;
  const id = parseInt(idParam);
  try {
    const team = await teamUseCase.getById(id);
    
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    const teamDTO = teamMapper.toDTO(team as any);
    return NextResponse.json(teamDTO);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idParam } = params;
  const id = parseInt(idParam);
  try {
    const body = await request.json();
    
    const team = await teamUseCase.update(id, body);
    
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    const teamDTO = teamMapper.toDTO(team as any);
    return NextResponse.json(teamDTO);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: idParam } = params;
  const id = parseInt(idParam);
  try {
    const success = await teamUseCase.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
