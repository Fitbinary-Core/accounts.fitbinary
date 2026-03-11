export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  description: string;
  is_active: boolean;
  is_final_level: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
