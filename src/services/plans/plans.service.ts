import { PLANS_URLS, BILLING_URLS } from "@/lib/urls";
import { apiClient } from "@/lib/apiClient";

export const getSubscriptionList = async (appId?: string) => {
    try {
        const url = appId ? `${PLANS_URLS.get_all}?app=${appId}` : PLANS_URLS.get_all;
        const response = await apiClient(url);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get subscriptions");
        }

        return data;
    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }
};

export const createCheckoutSession = async (data: {
    planId: string;
    provider: string;
}) => {
    try {
        const url = BILLING_URLS.checkout;
        const response = await apiClient(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.message || "Failed to create checkout session");
        }

        return resData;
    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }
};
export const getSessionStatus = async (sessionId: string) => {
    try {
        const url = BILLING_URLS.status(sessionId);
        const response = await apiClient(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get session status");
        }

        return data;
    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }
};
