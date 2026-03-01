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
