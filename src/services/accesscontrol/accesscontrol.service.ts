import { apiClient } from "@/lib/apiClient";
import { ACCESS_CONTROL_URLS } from "@/lib/urls";
import type {
  CreateAccessControlPayload,
  AccessControlDetailResponse,
} from "@/types/access-control";

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
      ...(filters.user && { user: filters.user }),
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

export const getAccessControlDetail = async (
  id: string,
): Promise<AccessControlDetailResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (id) {
      queryParams.append("id", id);
    }

    const response = await apiClient(
      `${ACCESS_CONTROL_URLS.detail.replace(":id", id)}`,
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

export const updateAccessControlService = async (
  id: string,
  data: Partial<CreateAccessControlPayload>,
) => {
  try {
    const response = await apiClient(
      ACCESS_CONTROL_URLS.update.replace(":id", id),
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to update access control");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const syncAccessControlService = async (data: {
  user_id: string;
  org_id: string;
  role_id: string;
  app?: string;
  branches: string[];
}) => {
  try {
    const response = await apiClient(ACCESS_CONTROL_URLS.sync, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to sync access control");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
