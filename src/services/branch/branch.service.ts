import { apiClient } from "@/lib/apiClient";
import { BRANCH_URLS } from "@/lib/urls";
import { Branch, BranchInput } from "@/schemas/branch";

export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export const createBranch = async (
  data: BranchInput,
): Promise<ApiResponse<Branch>> => {
  try {
    const response = await apiClient(BRANCH_URLS.base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create branch");
    }
    return result;
  } catch (error) {
    console.error("Error creating branch:", error);
    throw error;
  }
};

export const getMyBranches = async (
  page: number = 1,
  limit: number = 10,
): Promise<ApiResponse<Branch[]>> => {
  try {
    const response = await apiClient(
      `${BRANCH_URLS.my_branches}?page=${page}&limit=${limit}`,
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch branches");
    }
    return result;
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};

export const getUserBranchList = async (): Promise<ApiResponse<Branch[]>> => {
  try {
    const response = await apiClient(BRANCH_URLS.user_branches);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch branches");
    }
    return result;
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};

export const getBranchById = async (
  id: string,
): Promise<ApiResponse<Branch>> => {
  try {
    const response = await apiClient(BRANCH_URLS.one.replace(":id", id));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch branch");
    }
    return result;
  } catch (error) {
    console.error("Error fetching branch:", error);
    throw error;
  }
};

export const updateBranch = async (
  id: string,
  data: Partial<BranchInput>,
): Promise<ApiResponse<Branch>> => {
  try {
    const response = await apiClient(BRANCH_URLS.one.replace(":id", id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to update branch");
    }
    return result;
  } catch (error) {
    console.error("Error updating branch:", error);
    throw error;
  }
};

export const deleteBranch = async (
  id: string,
): Promise<{ message: string }> => {
  try {
    const response = await apiClient(BRANCH_URLS.one.replace(":id", id), {
      method: "DELETE",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to delete branch");
    }
    return result;
  } catch (error) {
    console.error("Error deleting branch:", error);
    throw error;
  }
};

export const getSourceBranches = async (): Promise<ApiResponse<Branch[]>> => {
  try {
    const response = await apiClient(BRANCH_URLS.source_branch);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch source branches");
    }
    return result;
  } catch (error) {
    console.error("Error fetching source branches:", error);
    throw error;
  }
};

export const getDestinationBranches = async (): Promise<
  ApiResponse<Branch[]>
> => {
  try {
    const response = await apiClient(BRANCH_URLS.destination_branches);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch destination branches");
    }
    return result;
  } catch (error) {
    console.error("Error fetching destination branches:", error);
    throw error;
  }
};

export const getBranchesByOrg = async (
  orgId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ApiResponse<Branch[]>> => {
  try {
    const response = await apiClient(
      `${BRANCH_URLS.branches_by_org}?orgId=${orgId}&page=${page}&limit=${limit}`,
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch branches by org");
    }
    return result;
  } catch (error) {
    console.error("Error fetching branches by org:", error);
    throw error;
  }
};
