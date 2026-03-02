import {
  getAllCategories as fetchAllCategories,
  getCategoryChildrens,
} from "./categories.service";
import type { Category } from "@/schemas/categories";

const categoriesSelectorService = {
  getAllCategories: async (opts?: {
    queries?: { debouncedSearchQuery?: string };
  }): Promise<Category[]> => {
    const list = await fetchAllCategories();
    const q = opts?.queries?.debouncedSearchQuery?.toLowerCase().trim();
    if (!q) return list;
    const filter = (c: Category) =>
      c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
    return list.filter(filter);
  },

  getCategoryChildren: (parentId: string): Promise<Category[]> =>
    getCategoryChildrens(parentId),
};

export default categoriesSelectorService;
