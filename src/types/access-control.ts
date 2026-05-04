export interface AccessControlUser {
  _id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  email: string;
  phone: string;
  dob: string;
  is_active: boolean;
  is_verified: boolean;
  last_signin: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AccessControlBranch {
  _id: string;
  branch_name: string;
  branch_location: string;
  branch_type: string;
  branch_organization: string;
  is_main: boolean;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AccessControlOrganization {
  _id: string;
  business_name: string;
  business_type: string;
  business_logo: string | null;
  business_description: string;
  business_size: string;
  main_branch: string | null;
  application: string;
  user: string;
  onboarding_completed: boolean;
  business_email: string;
  business_phone: string;
  country: string;
  state: string;
  district: string;
  municipality: string;
  location: string;
  landmark: string;
  timezone: string;
  currency: string;
  subscription_status: string;
  subscription: string;
  trial_ends_at: string;
  subscription_ends_at: string;
  is_registered: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AccessControlRole {
  _id: string;
  application: string;
  role_name: string;
  role_key: string;
  permissions: string[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  role_scope: "BRANCH" | "ORGANIZATION";
}

export interface AccessControlDetailData {
  _id: string;
  user_id: AccessControlUser;
  branch_id?: AccessControlBranch | null;
  org_id: AccessControlOrganization;
  app: string;
  __v: number;
  createdAt: string;
  invited_by?: AccessControlUser | null;
  role_id: AccessControlRole;
  status: string;
  updatedAt: string;
}

export interface AccessControlDetailResponse {
  message: string;
  data: AccessControlDetailData;
}

export interface CreateAccessControlPayload {
  user_id: string;
  org_id: string;
  app?: string;
  role_id: string;
  branches: string[];
}

