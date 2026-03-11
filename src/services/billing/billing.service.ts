import { apiClient } from "@/lib/apiClient";
import { BILLING_URLS } from "@/lib/urls";
import { SubscriptionResponse } from "@/types/billing";

export const getOrganizationSubscriptions =
  async (): Promise<SubscriptionResponse> => {
    try {
      const response = await apiClient(BILLING_URLS.organization_subscriptions);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch organization subscriptions",
        );
      }
      return data;
    } catch (error) {
      console.error("Error fetching organization subscriptions:", error);
      throw error;
    }
  };
