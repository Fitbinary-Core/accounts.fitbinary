export type SignUpFormDataPayload = {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
};

export interface SignUpProps {
    payload: SignUpFormDataPayload;
}

export type LoginFormDataPayload = {
    email: string;
    password: string;
};

export interface LoginResBodyFields {
    accessToken: string;
    redirect_url: string;
    refreshToken: string;
}

export interface LoginResBody {
    data: LoginResBodyFields;
    message: string;
}

export interface IRole {
    _id: string;
    role_name: string;
    role_key: string;
    permissions: string[];
    is_active: boolean;
    application: string;
    createdAt: string;
    updatedAt: string;
}

export interface IBranch {
    _id: string;
    branch_name: string;
    branch_location: string;
    branch_organization: string;
    branch_tenant: string;
    is_main: boolean;
    latitude?: number;
    longitude?: number;
    createdAt: string;
    updatedAt: string;
}

export interface IOrganization {
    _id: string;
    business_name: string;
    location: string;
    currency: string;
    business_logo?: string;
}

export interface ProfileData {
    _id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone: string;
    onboarding_completed: boolean;
    role: IRole | string;
    branches: IBranch[];
    organization: IOrganization;
    updatedAt: string;
    createdAt: string;
}

export interface ProfileResponse {
    data: ProfileData;
    message: string;
}

export interface SubscriptionFeature {
    _id: string;
    app: string;
    name: string;
    code: string;
    description: string | null;
    subscription: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface SubscriptionPlan {
    _id: string;
    name: string;
    description: string;
    app: string;
    price: number;
    is_active: boolean;
    is_trail?: boolean;
    sort_order: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    features: {
        code: string;
        type: "BOOLEAN" | "NUMBER";
        value: any;
        _id?: string;
    }[];
}

export interface PlansResponse {
    message: string;
    subscriptions: SubscriptionPlan[];
}

export interface SubscriptionFeatureItem {
    app: string;
    name: string;
    code: string;
    subscription: string;
    is_active: boolean;
}

export interface SubscriptionDetails {
    subscription_type: "TRIAL" | "PAID";
    status: string;
    organization_id: string;
    trial_ends_at?: string;
    is_trial_active?: boolean;
    subscription?:
    | {
        _id: string;
        name: string;
    }
    | string;
    subscription_ends_at?: string;
    features?: SubscriptionFeatureItem[];
}
