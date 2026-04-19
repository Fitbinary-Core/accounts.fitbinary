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
  key?: string | null;
  accessToken: string;
  redirect_url?: string;
  refreshToken: string;
}

export interface LoginResBody {
  data: LoginResBodyFields;
  message: string;
}

export interface IPermission {
  key: string;
  label: string;
}

export interface IRole {
  role_name: string;
  role_key: string;
  permissions: IPermission[];
}

export interface IBranch {
  branch_name: string;
  branch_location: string;
}

export interface IOrganization {
  business_name: string;
  business_logo: string | null;
}

export interface IUser {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export interface ProfileData {
  user: IUser;
  organization: IOrganization;
  branch: IBranch;
  role: IRole;
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
