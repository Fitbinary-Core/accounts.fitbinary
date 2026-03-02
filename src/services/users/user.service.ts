import { apiClient } from "@/lib/apiClient";
import { USERS_URLS } from "@/lib/urls";
import { ApiResponse, User, UserFormData } from "@/schemas/user";

export interface UserQueryProps {
  page?: number;
  limit?: number;
  search?: string;
  branch?: string;
  role?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const createUserService = async (
  data: UserFormData,
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient(USERS_URLS.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create user");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const getUsersListService = async (
  params: UserQueryProps,
): Promise<ApiResponse<User[]>> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.branch) queryParams.append("branch", params.branch);
    if (params.role) queryParams.append("role", params.role);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);

    const response = await apiClient(`${USERS_URLS.get_all}?${queryParams}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch users");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const getUserOneService = async (
  id: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient(USERS_URLS.get_one.replace(":id", id));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch user");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateUserService = async (
  id: string,
  data: Partial<UserFormData>,
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient(USERS_URLS.update.replace(":id", id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to update user");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteUserService = async (
  id: string,
): Promise<{ message: string }> => {
  try {
    const response = await apiClient(USERS_URLS.delete.replace(":id", id), {
      method: "DELETE",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to delete user");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
