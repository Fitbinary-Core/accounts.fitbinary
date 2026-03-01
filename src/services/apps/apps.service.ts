import { apiClient } from "@/lib/apiClient";
import { ACCOUNTS_APPS_URLS } from "@/lib/urls";
import { IAppsResponse } from "@/types/apps";

export const get_all_apps = async (): Promise<IAppsResponse> => {
  const url = ACCOUNTS_APPS_URLS.all_apps;

  try {
    const response = await apiClient(url);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to get apps list");
    }

    return result as IAppsResponse;
  } catch (error) {
    throw error;
  }
};

export const get_users_all_apps = async () => {
  const url = ACCOUNTS_APPS_URLS.all_users_apps;

  try {
    const response = await apiClient(url);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to get users apps list");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
