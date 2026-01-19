import { SigninValues } from "@/components/auth/signin-form";
import { apiClient } from "@/lib/apiClient";
import { TENANT_AUTH_URLS } from "@/lib/urls";

export interface Tenant {
  _id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  avatar: string | null;
  role: "Owner" | string;
  onboarding_completed: boolean;
  organization: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  message: string;
  tenant: Tenant;
}

export interface SignUpUserProps {
  first_name: string;
  middle_name?: string;
  last_name: string;
  dob: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  avatar?: string;
}

export const userProfile = async (): Promise<UserProfileResponse> => {
  try {
    const url = TENANT_AUTH_URLS.profile;
    const response = await apiClient(url);
    const body = await response.json();
    if (!response.json) {
      throw new Error(body.message);
    }

    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const loginUser = async (data: SigninValues) => {
  try {
    const url = TENANT_AUTH_URLS.login;
    const response = await apiClient(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body: any = await response.json();

    if (!response.json) {
      throw new Error(body.message);
    }

    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const signUpUser = async (
  data: SignUpUserProps,
): Promise<{ message: string }> => {
  try {
    const url = TENANT_AUTH_URLS.tenant_signup;
    const { confirm_password, ...payload } = data;

    const response = await apiClient(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "Signup failed");
    }

    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export async function logoutUser() {
  try {
    const url = TENANT_AUTH_URLS.logout;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout!");
    }

    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}
