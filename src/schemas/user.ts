import { z } from "zod";

export enum ROLE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
  FINANCE = "FINANCE",
  VIEWER = "VIEWER",
}

export interface User {
  _id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  is_active: boolean;
  is_verified: boolean;
  last_signin: string | null;
  organization: {
    _id: string;
    business_name: string;
    business_logo?: string;
  };
  branches: Array<{
    _id: string;
    branch_name: string;
    branch_location: string;
  }>;
  app: {
    _id: string;
    name: string;
    app_slug: string;
  };
  role: {
    _id: string;
    role_name: string;
    role_key: string;
    permissions?: Array<{
      _id: string;
      label: string;
      key: string;
    }>;
    role_scope?: "ORGANIZATION" | "BRANCH";
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export const userSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  password: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
  role: z.string().optional(),
  organization: z.string().min(1, "Organization is required"),
  branches: z.array(z.string()),
  mode: z.enum(["create", "invite"]),
  selectedUserId: z.string().nullable(),
});

export type UserFormData = z.infer<typeof userSchema>;
