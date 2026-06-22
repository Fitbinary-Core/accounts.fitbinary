"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Phone,
  Lock,
  User as UserIcon,
  Loader2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBranchesByOrg } from "@/services/branch/branch.service";
import { get_organization_list } from "@/services/organization/organization.service";
import OrganizationSelector from "@/components/common/OrganizationSelector";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import {
  get_user_roles_list,
  type Role,
} from "@/services/roles/roles.services";
import BranchSelector from "@/components/common/BranchSelector";
import { DashboardLayout } from "@/components/dashboard/Layout";
import {
  getAccessControlDetail,
  getAccessControlList,
  syncAccessControlService,
} from "@/services/accesscontrol/accesscontrol.service";
import type {
  AccessControlDetailData,
  AccessControlRole,
} from "@/types/access-control";

const accessControlEditSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  role: z.string().min(1, "Role is required"),
  branches: z.array(z.string()).optional(),
});

type AccessControlFormData = z.infer<typeof accessControlEditSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();
  const [selectedRoleScope, setSelectedRoleScope] = useState<
    "ORGANIZATION" | "BRANCH" | null
  >(null);

  const { data: orgsData, isLoading: isLoadingOrgs } = useQuery({
    queryKey: ["organization-list"],
    queryFn: () => get_organization_list(),
  });
  const organizations = orgsData?.organizations || [];

  const { data: accesscontrolResponse, isLoading: isLoadingAccessControl } =
    useQuery({
      queryKey: ["accesscontrol", id],
      queryFn: () => getAccessControlDetail(id),
    });
  const accesscontrol = accesscontrolResponse?.data;
  const user = accesscontrol?.user_id;

  const form = useForm<AccessControlFormData>({
    resolver: zodResolver(accessControlEditSchema),
    defaultValues: {
      role: "",
      organization: "",
      branches: [],
    },
  });

  const { watch, setValue, reset } = form;
  const selectedOrganizationId = watch("organization");

  const { data: branchesByOrg, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches-by-org", selectedOrganizationId],
    queryFn: () => getBranchesByOrg(selectedOrganizationId as string),
    enabled: !!selectedOrganizationId,
  });

  console.log("Branches by org: ", branchesByOrg);

  const selectedOrganization = useMemo(() => {
    return organizations.find((o) => o._id === selectedOrganizationId);
  }, [organizations, selectedOrganizationId]);

  const { data: roles } = useQuery({
    queryKey: ["user-roles", selectedOrganizationId],
    queryFn: () => get_user_roles_list(undefined, selectedOrganizationId),
    enabled: !!selectedOrganizationId,
  });

  const userIdForFilter = user?._id;
  const orgIdForFilter = accesscontrol?.org_id?._id;

  const { data: userAccessList } = useQuery({
    queryKey: ["user-access-list", userIdForFilter, orgIdForFilter],
    queryFn: () =>
      getAccessControlList(1, 100, "", {
        user: userIdForFilter as string,
        org: orgIdForFilter as string,
      }),
    enabled: !!userIdForFilter && !!orgIdForFilter,
  });

  useEffect(() => {
    if (accesscontrol && userAccessList) {
      const userRole = accesscontrol.role_id;
      if (userRole && userRole.role_scope) {
        setSelectedRoleScope(userRole.role_scope);
      }

      const orgId = accesscontrol.org_id?._id || "";
      const roleId = accesscontrol.role_id?._id || "";
      const branchIds = Array.from(
        new Set<string>(
          userAccessList?.data
            ?.map((ac: any) => ac.branch_id?._id)
            .filter(Boolean) || [],
        ),
      );

      reset({
        role: roleId,
        organization: orgId,
        branches: branchIds,
      });
    }
  }, [accesscontrol, userAccessList, reset]);

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles?.data.find((r: Role) => r._id === roleId);
    if (selectedRole) {
      setSelectedRoleScope(
        (selectedRole.role_scope as "BRANCH" | "ORGANIZATION") || "BRANCH",
      );
      if (selectedRole.role_scope === "ORGANIZATION") {
        setValue("branches", []);
      }
    }
    setValue("role", roleId);
  };

  const updateMutation = useMutation({
    mutationFn: (data: AccessControlFormData) => {
      const payload = {
        user_id: user?._id || "",
        org_id: data.organization,
        role_id: data.role,
        branches:
          selectedRoleScope === "ORGANIZATION" ? [] : data.branches || [],
      };
      return syncAccessControlService(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accesscontrol", id] });
      queryClient.invalidateQueries({ queryKey: ["accesscontrol-list"] });
      toast.success("Access control updated successfully!");
      router.push("/user-management/users");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong. Please try again.");
    },
  });

  async function onSubmit(data: AccessControlFormData) {
    if (
      selectedRoleScope === "BRANCH" &&
      (!data.branches || data.branches.length === 0)
    ) {
      toast.error("Please select at least one branch for this role.");
      return;
    }
    updateMutation.mutate(data);
  }

  if (isLoadingAccessControl || isLoadingOrgs) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="size-10 animate-spin text-zinc-900" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            Retrieving Access Control Data...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title="Update Access Control"
          description={
            selectedOrganization
              ? `Modifying access permissions within ${selectedOrganization.business_name}.`
              : "Updating user access control and permissions."
          }
          actions={
            <Button
              onClick={() => router.push("/user-management/users")}
              className="flex items-center gap-2 h-10 px-4 border-zinc-200 text-zinc-900 text-[11px] font-bold tracking-widest rounded-sm hover:bg-zinc-50 hover:border-zinc-900 transition-all shadow-none border"
            >
              <ArrowLeft size={14} />
              <span>Back to Registry</span>
            </Button>
          }
        />

        <div className="w-full">
          {/* User Preview block */}
          {user && (
            <div className="mb-8 rounded-sm border border-zinc-200 bg-white overflow-hidden shadow-none w-full mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="border-b border-zinc-100 bg-zinc-50/30 px-6 py-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-zinc-900 tracking-tight">
                    User Information (Read Only)
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Name
                    </label>
                    <div className="mt-1 flex items-center h-11 pl-3 bg-zinc-50 border border-zinc-200 rounded-sm text-sm text-zinc-700">
                      <UserIcon size={14} className="text-zinc-400 mr-2" />
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Email
                    </label>
                    <div className="mt-1 flex items-center h-11 pl-3 bg-zinc-50 border border-zinc-200 rounded-sm text-sm text-zinc-700">
                      <Mail size={14} className="text-zinc-400 mr-2" />
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Phone
                    </label>
                    <div className="mt-1 flex items-center h-11 pl-3 bg-zinc-50 border border-zinc-200 rounded-sm text-sm text-zinc-700">
                      <Phone size={14} className="text-zinc-400 mr-2" />
                      {user.phone || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-sm border border-zinc-200 bg-white overflow-hidden shadow-none w-full mx-auto">
            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 tracking-widest">
                  Organization Environment
                </label>
                <Controller
                  name="organization"
                  control={form.control}
                  render={({ field }) => (
                    <OrganizationSelector
                      organizations={organizations}
                      multi={false}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={updateMutation.isPending}
                      placeholder="Select organization context..."
                    />
                  )}
                />
                {form.formState.errors.organization && (
                  <p className="text-red-900 text-[10px] font-bold">
                    {form.formState.errors.organization.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {selectedOrganizationId && (
            <div className="mt-8 rounded-sm border border-zinc-200 bg-white overflow-hidden shadow-none w-full mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="border-b border-zinc-100 bg-zinc-50/30 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-bold tracking-widest rounded-sm">
                    {selectedOrganization?.business_name || "EDIT"}
                  </span>
                  <h2 className="text-sm font-black text-zinc-900 tracking-tight">
                    Access list
                  </h2>
                </div>
              </div>

              <div className="p-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black text-zinc-500 tracking-widest">
                              Role
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={handleRoleChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full py-5 border-zinc-200 focus:ring-0 focus:border-zinc-900 text-zinc-900 text-sm rounded-sm shadow-none">
                                  <SelectValue placeholder="Assign privilege role" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-zinc-200 rounded-sm shadow-xl">
                                  <SelectGroup>
                                    <SelectLabel className="text-[10px] font-black text-zinc-400 tracking-widest px-2 py-1.5">
                                      Available Roles
                                    </SelectLabel>
                                    {roles ? (
                                      roles.data.map((role: any) => (
                                        <SelectItem
                                          key={role._id}
                                          value={role._id}
                                          className="text-xs font-bold text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900 cursor-pointer rounded-sm"
                                        >
                                          {role.role_name}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
                                      </div>
                                    )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-zinc-900 text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="branches"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Resource Access Tags (Branches)
                          </FormLabel>
                          <FormControl>
                            <BranchSelector
                              multi={true}
                              branches={branchesByOrg?.data || []}
                              value={field.value || []}
                              onChange={field.onChange}
                              disabled={isLoadingBranches}
                              placeholder="Bind user to active branches"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] text-zinc-900 font-bold" />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="w-full h-12 bg-zinc-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-sm cursor-pointer shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {updateMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating Changes...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Save size={18} />
                            Confirm Updates
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
