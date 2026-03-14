import { ITeamMember } from "@domain/models/team-member.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { TeamMember } from "../../entities/index";

export class TeamMemberRepository {
  async create(teamMember: ITeamMember): Promise<InstanceType<typeof TeamMember>> {
    return await TeamMember.create<InstanceType<typeof TeamMember>>({ ...teamMember });
  }

  async findById(id: string): Promise<InstanceType<typeof TeamMember> | null> {
    return await TeamMember.findByPk<InstanceType<typeof TeamMember>>(id);
  }

  async getAll(): Promise<InstanceType<typeof TeamMember>[]> {
    return await TeamMember.findAll<InstanceType<typeof TeamMember>>({
      order: [
        ["order", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
  }

  async update(id: string, teamMember: Partial<ITeamMember>): Promise<InstanceType<typeof TeamMember> | null> {
    const existing = await TeamMember.findByPk<InstanceType<typeof TeamMember>>(id);
    if (!existing) throw new NotFoundException("TeamMember", id);
    await existing.update(teamMember);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    const member = await TeamMember.findByPk<InstanceType<typeof TeamMember>>(id);
    if (!member) throw new NotFoundException("TeamMember", id);
    await member.destroy();
    return true;
  }
}
