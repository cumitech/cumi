import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ITutorialSubcategory {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const emptyTutorialSubcategory: ITutorialSubcategory = {
  id: "",
  name: "",
  slug: "",
  description: "",
  icon: "",
  color: "#667eea",
  sortOrder: 0,
};

export interface ITutorialSubcategoryState extends IBaseState {
  readonly tutorialSubcategories: ITutorialSubcategory[];
  readonly tutorialSubcategory: ITutorialSubcategory;
}

export interface ITutorialSubcategoryResponse extends IResponseBase {
  data: ITutorialSubcategory | null | ITutorialSubcategory[];
}

