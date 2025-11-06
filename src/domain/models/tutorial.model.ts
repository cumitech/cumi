import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ITutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  slug: string;
  publishedAt?: Date;
  authorId: string;
  subcategoryId: string;
  status: string;
  viewCount?: number;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
  Subcategory?: any;
  User?: any;
  tags?: string[];
  Tags?: any;
}

export const emptyTutorial: ITutorial = {
  id: "",
  slug: "",
  title: "",
  content: "",
  imageUrl: "",
  publishedAt: new Date(),
  authorId: "",
  subcategoryId: "",
  description: "",
  status: "DRAFT",
  viewCount: 0,
  difficulty: "BEGINNER",
  estimatedTime: 0,
  tags: [],
};

export interface ITutorialState extends IBaseState {
  readonly tutorials: ITutorial[];
  readonly tutorial: ITutorial;
}

export interface ITutorialResponse extends IResponseBase {
  data: ITutorial | null | ITutorial[];
}

