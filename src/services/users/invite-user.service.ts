import { apiClient } from "@/lib/apiClient";
import { USERS_URLS } from "@/lib/urls";
import type { InviteUsersResponse } from "@/types/invite-user";

export interface InviteUserQueryProps {
  page?: number;
  limit?: number;
  search?: string;
}

export const getInviteUsersList = async (
  params: InviteUserQueryProps = {},
): Promise<InviteUsersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);

    const response = await apiClient(
      `${USERS_URLS.invite_users_list}?${queryParams}`,
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch invite users");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
