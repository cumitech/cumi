export interface ITeamMember {
  id: string;
  fullName: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyTeamMember: ITeamMember = {
  id: "",
  fullName: "",
  role: null,
  bio: null,
  imageUrl: null,
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
