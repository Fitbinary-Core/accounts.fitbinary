export interface InviteUser {
  _id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
  phone: string;
  dob: string;
  is_active: boolean;
  is_verified: boolean;
  last_signin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InviteUsersResponse {
  data: InviteUser[];
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
  };
}
