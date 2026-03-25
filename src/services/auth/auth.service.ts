import { SigninValues } from "@/components/auth/signin-form";
import { apiClient } from "@/lib/apiClient";
import { AUTH_URLS, TENANT_AUTH_URLS } from "@/lib/urls";
import { SignUpUserProps, UserProfileResponse } from "@/types/auth";
import { ProfileResponse, SubscriptionDetails } from "./types/auth.types";

export const userProfile = async (): Promise<UserProfileResponse> => {
  try {
    const url = AUTH_URLS.profile;
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

export async function getUserProfile(): Promise<ProfileResponse> {
  try {
    const url = AUTH_URLS.profile;
    const response = await apiClient(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "Failed to get user profile details!");
    }

    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getSubscriptionDetails(): Promise<SubscriptionDetails> {
  try {
    const url = TENANT_AUTH_URLS.subscription_details;
    const response = await apiClient(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get subscription details!");
    }

    return data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export const loginUser = async (data: SigninValues) => {
  try {
    const url = AUTH_URLS.login;
    const response = await apiClient(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, app_slug: 'accounts.fitbinary' }),
    });

    const body: any = await response.json();

    if (!response.ok) {
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
    const url = AUTH_URLS.signup;
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
    const url = AUTH_URLS.logout;
    const response = await apiClient(url, {
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

export const sendForgetPasswordPin = async (email: string) => {
  try {
    const url = TENANT_AUTH_URLS.forget_password_pin;
    const response = await apiClient(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || "Failed to send reset PIN");
    }
    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const verifyForgetPasswordPin = async (email: string, otp: string) => {
  try {
    const url = `${TENANT_AUTH_URLS.verify_forget_password_pin}?email=${encodeURIComponent(email)}&OTP=${encodeURIComponent(otp)}`;
    const response = await apiClient(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || "Failed to verify PIN");
    }
    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  try {
    const url = TENANT_AUTH_URLS.reset_password;
    const response = await apiClient(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || "Failed to reset password");
    }
    return body;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
