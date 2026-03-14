import { ITeamMember } from "@domain/models/team-member.model";
import { TeamMemberRepository } from "@data/repositories/impl/team-member.repository";

export class TeamMemberUseCase {
  constructor(private teamMemberRepository: TeamMemberRepository) {}

  async getAll(): Promise<ITeamMember[]> {
    const list = await this.teamMemberRepository.getAll();
    return list.map((m: any) => m.toJSON?.() ?? m.dataValues ?? m);
  }

  async getById(id: string): Promise<ITeamMember | null> {
    const member = await this.teamMemberRepository.findById(id);
    return member ? ((member as any).toJSON?.() ?? (member as any).dataValues ?? member) : null;
  }

  async create(teamMember: Omit<ITeamMember, "id" | "createdAt" | "updatedAt">): Promise<ITeamMember> {
    const created = await this.teamMemberRepository.create(teamMember as ITeamMember);
    return (created as any).toJSON?.() ?? (created as any).dataValues ?? created;
  }

  async update(id: string, teamMember: Partial<ITeamMember>): Promise<ITeamMember | null> {
    const updated = await this.teamMemberRepository.update(id, teamMember);
    return updated ? ((updated as any).toJSON?.() ?? (updated as any).dataValues ?? updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    return await this.teamMemberRepository.delete(id);
  }
}
