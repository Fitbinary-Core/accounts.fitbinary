import { z } from "zod";

export const BRANCH_TYPES = [
  "Retail Store",
  "Warehouse",
  "Distribution Center",
  "Head Office",
  "Online / E-commerce Branch",
  "Franchise Outlet",
  "Manufacturing Unit",
  "Showroom",
  "Service Center",
  "Dark Store",
  "Pickup Point",
  "Fulfillment Center",
  "Regional Office",
  "Wholesale Outlet",
] as const;

export const branchSchema = z.object({
  branch_name: z.string().min(2, "Branch name must be at least 2 characters"),
  branch_location: z
    .string()
    .min(5, "Branch location must be at least 5 characters"),
  branch_type: z.enum(BRANCH_TYPES, {
    message: "Please select a branch type",
  }),
  application: z.string().min(1, "Please select an application"),
  is_main: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type BranchInput = z.infer<typeof branchSchema>;

export interface Branch {
  _id: string;
  application: string;
  branch_name: string;
  branch_location: string;
  branch_type: (typeof BRANCH_TYPES)[number];
  branch_organization: string;
  branch_tenant: string;
  is_main: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}
