import { z } from "zod";

export const BRANCH_TYPES = [
  "Head Office",
  "Branch Office",
  "Retail Outlet",
  "Warehouse",
  "Distribution Center",
  "Operations Center",
  "Service Center",
  "Fulfillment Center",
  "Pickup Point",
  "Showroom",
  "Franchise Location",
  "Production Unit",
  "Regional Office",
  "Storage Facility",
  "Other",
] as const;

export const branchSchema = z.object({
  branch_name: z.string().min(2, "Branch name must be at least 2 characters"),
  branch_location: z
    .string()
    .min(5, "Branch location must be at least 5 characters"),
  branch_type: z.enum(BRANCH_TYPES, {
    message: "Please select a branch type",
  }),
  organization: z.string().min(1, "Please select an organization"),
  is_main: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type BranchInput = z.infer<typeof branchSchema>;

export interface PopulatedOrganization {
  _id: string;
  business_name: string;
  business_logo?: string;
  location?: string;
}

export interface Branch {
  _id: string;
  organization: string;
  branch_name: string;
  branch_location: string;
  branch_type: (typeof BRANCH_TYPES)[number];
  branch_organization: string | PopulatedOrganization;
  branch_tenant: string;
  is_main: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}
