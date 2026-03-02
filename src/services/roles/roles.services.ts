import { apiClient } from "@/lib/apiClient";
import { ROLES_URLS } from "@/lib/urls";

export interface Permission {
  _id: string;
  label: string;
  key: string;
}

export interface Role {
  _id: string;
  role_name: string;
  role_key: string;
  is_active: boolean;
  permissions: Permission[];
  role_scope?: "ORGANIZATION" | "BRANCH";
  createdAt: string;
  updatedAt: string;
}

export interface GetRolesResponse {
  message: string;
  data: Role[];
}

export const get_user_roles_list = async (): Promise<GetRolesResponse> => {
  try {
    const url = ROLES_URLS.get_roles_list;
    const response = await apiClient(url);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to get user roles");
    }

    return data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
