export interface ITenantMinimal {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export interface IOrganization {
  _id: string;
  business_name: string;
  business_type: string;
  business_size: string;
  tenant: ITenantMinimal;
  onboarding_completed: boolean;
  business_email: string;
  business_phone: string;
  business_logo?: string;
  business_description?: string;
  country?: string;
  state?: string;
  district?: string;
  municipality?: string;
  location?: string;
  landmark?: string;
  timezone?: string;
  currency?: string;
  language?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IOrganizationListResponse {
  message: string;
  organizations: IOrganization[];
}
