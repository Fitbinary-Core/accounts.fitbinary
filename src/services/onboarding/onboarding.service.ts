import { apiClient } from "@/lib/apiClient";
import { BILLING_URLS, COMMON_URLS, ONBOARDING_URLS } from "@/lib/urls";
import {
  OnboardingDataRes,
  BusinessDetailPayload,
  LocationAndMetadataDetailsPayload,
  BranchInput,
  OrganizationType,
} from "@/schemas/onboarding";

export const get_onboarding_data = async (
  appId?: string,
): Promise<OnboardingDataRes> => {
  try {
    const url = appId
      ? `${ONBOARDING_URLS.get_data}?app_id=${appId}`
      : ONBOARDING_URLS.get_data;

    const response = await apiClient(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get onboarding data");
    }

    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

// Create / Update
export const update_business_details = async (
  data: BusinessDetailPayload,
): Promise<{ message: string; organization: OrganizationType }> => {
  try {
    const url = ONBOARDING_URLS.create_update_organization;
    const response = await apiClient(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(
        body.message || "Failed to create or update organization",
      );
    }

    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

// Update Location and Metadata Details
export const update_location_and_metadata = async (
  data: LocationAndMetadataDetailsPayload,
): Promise<{ message: string }> => {
  try {
    const url = ONBOARDING_URLS.update_location_and_metadata;
    const response = await apiClient(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "Failed to update location & metadata");
    }

    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const create_update_main_branch = async (data: BranchInput) => {
  try {
    const url = ONBOARDING_URLS.create_update_main_branch;
    const response = await apiClient(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create or update main branch");
    }

    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const getLogoPresignedUrl = async (key: string) => {
  try {
    const url = `${COMMON_URLS.get_logo_presigned_url}?key=${key}`;
    const response = await apiClient(url, {
      method: "POST",
    });
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "Failed to get presigned url");
    }
    return body;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const startFreeTrial = async (planId: string | undefined) => {
  try {
    const url = BILLING_URLS.start_free_trail;
    const response = await apiClient(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planId, provider: "TRAIL" }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to start free trial");
    }

    return data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
