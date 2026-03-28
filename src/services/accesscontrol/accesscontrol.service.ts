import { apiClient } from "@/lib/apiClient";
import { ACCESS_CONTROL_URLS } from "@/lib/urls";

interface CreateAccessControlPayload {
  user_id: string;
  org_id: string;
  app?: string;
  role_id: string;
  branches: string[];
}

export const createAccessControlService = async (
  data: CreateAccessControlPayload,
) => {
  try {
    const response = await apiClient(ACCESS_CONTROL_URLS.create, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create access control");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const getAccessControlList = async (
  page = 1,
  limit = 10,
  search = "",
  filters: Record<string, string> = {},
  sort = "createdAt-desc",
) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(filters.branch && { branch: filters.branch }),
      ...(filters.org && { org: filters.org }),
      ...(sort && { sort }),
    }).toString();

    const response = await apiClient(
      `${ACCESS_CONTROL_URLS.list}?${queryParams}`,
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to get access control list");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
