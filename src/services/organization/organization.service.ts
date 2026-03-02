import { apiClient } from "@/lib/apiClient";
import { ORGANIZATION_URLS } from "@/lib/urls";

import { IOrganizationListResponse } from "@/types/organization";

export const get_organization_list =
  async (): Promise<IOrganizationListResponse> => {
    try {
      const url = ORGANIZATION_URLS.list;
      const response = await apiClient(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to get organization list");
      }

      return result;
    } catch (error) {
      throw error;
    }
  };
