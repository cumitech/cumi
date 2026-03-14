export interface ITestimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyTestimonial: ITestimonial = {
  id: "",
  quote: "",
  authorName: "",
  authorRole: null,
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
