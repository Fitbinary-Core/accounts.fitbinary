import { SigninValues } from "@/components/auth/signin-form";
import { apiClient } from "@/lib/apiClient";
import { AUTH_URLS } from "@/lib/urls";

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

export const loginUser = async (data: SigninValues) => {
  console.log("Data: ", data);
  try {
    const url = AUTH_URLS.login;
    const response = await apiClient(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response in service: ", response);

    const body: any = await response.json();

    if (!response.json) {
      throw new Error(body);
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
    const url = AUTH_URLS.tenant_signup;
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

export const logOutUser = async () => {
  try {
  } catch (error) {}
};
