import { apiClient } from "@/lib/apiClient";
import { CATEGORIES_URLS, ONBOARDING_URLS } from "@/lib/urls";
import { Category } from "@/schemas/categories";

export const getOnboardingCategories = async (): Promise<Category[]> => {
  try {
    const url = ONBOARDING_URLS.get_categories;
    const response = await apiClient(url);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const url = CATEGORIES_URLS.get_all;
    const response = await apiClient(url);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryChildrens = async (id: string): Promise<Category[]> => {
  try {
    const url = CATEGORIES_URLS.get_childrens.replace(":id", id);
    const response = await apiClient(url);
    if (!response.ok) {
      throw new Error("Failed to fetch category children");
    }
    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching category children:", error);
    throw error;
  }
};

export const updateTenantCategories = async (
  ids: string[],
): Promise<{ message: string }> => {
  try {
    const url = ONBOARDING_URLS.update_categories;
    const response = await apiClient(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update tenant categories");
    }
    return data;
  } catch (error) {
    console.error("Error updating tenant categories:", error);
    throw error;
  }
};

export const getTenantSelectedCategories = async (): Promise<Category[]> => {
  try {
    const url = ONBOARDING_URLS.get_categories;
    const response = await apiClient(url);
    if (!response.ok) {
      throw new Error("Failed to fetch tenant categories");
    }
    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tenant categories:", error);
    throw error;
  }
};

export const getCategoryDetail = async (
  id: string,
): Promise<{ data: Category }> => {
  try {
    const url = CATEGORIES_URLS.get_detail.replace(":id", id);
    const response = await apiClient(url);
    if (!response.ok) {
      throw new Error("Failed to fetch category details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching category details:", error);
    throw error;
  }
};
