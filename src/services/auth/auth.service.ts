import { SigninValues } from "@/components/auth/signin-form";
import { apiClient } from "@/lib/apiClient";
import { AUTH_URLS } from "@/lib/urls";

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

export const signUpUser = async (data: SigninValues) => {
  try {
    const url = AUTH_URLS.signup;
    const response = await apiClient(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body: any = await response.json();

    if (!response.ok) {
      throw new Error(body);
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
