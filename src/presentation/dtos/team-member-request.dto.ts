import { ITeamMember } from "@domain/models/team-member.model";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TeamMemberRequestDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  order?: number;

  constructor(data: Partial<ITeamMember>) {
    this.fullName = data.fullName ?? "";
    this.role = data.role ?? undefined;
    this.bio = data.bio ?? undefined;
    this.imageUrl = data.imageUrl ?? undefined;
    this.order = data.order ?? 0;
  }

  toData(): Omit<ITeamMember, "id" | "createdAt" | "updatedAt"> {
    return {
      fullName: this.fullName,
      role: this.role ?? null,
      bio: this.bio ?? null,
      imageUrl: this.imageUrl ?? null,
      order: this.order ?? 0,
    };
  }

  toUpdateData(existing: ITeamMember): Partial<ITeamMember> {
    return {
      fullName: this.fullName,
      role: this.role ?? existing.role,
      bio: this.bio ?? existing.bio,
      imageUrl: this.imageUrl ?? existing.imageUrl,
      order: this.order ?? existing.order,
      updatedAt: new Date(),
    };
  }
}
