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
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData } from "@/schemas/user";
import {
  getUserOneService,
  updateUserService,
} from "@/services/users/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const { data: userResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserOneService(id),
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
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

  const selectedOrganization = useMemo(() => {
    return organizations.find((o) => o._id === selectedOrganizationId);
  }, [organizations, selectedOrganizationId]);

  const { data: roles } = useQuery({
    queryKey: ["user-roles", selectedOrganizationId],
    queryFn: () => get_user_roles_list(undefined, selectedOrganizationId),
    enabled: !!selectedOrganizationId,
  });

  useEffect(() => {
    if (userResponse?.data) {
      const user = userResponse.data;

      const userRole = typeof user.role === "object" ? user.role : null;
      if (userRole) {
        setSelectedRoleScope(userRole.role_scope || "BRANCH");
      }

      const orgId =
        typeof user.organization === "object"
          ? user.organization._id
          : user.organization;

      reset({
        first_name: user.first_name,
        middle_name: user.middle_name || "",
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        password: "",
        role: typeof user.role === "object" ? user.role._id : user.role,
        organization: orgId || "",
        branches: Array.isArray(user.branches)
          ? user.branches.map((b: any) => (typeof b === "object" ? b._id : b))
          : [],
      });
    }
  }, [userResponse, reset]);

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles?.data.find((r: Role) => r._id === roleId);
    if (selectedRole) {
      setSelectedRoleScope(selectedRole.role_scope || "BRANCH");
      if (selectedRole.role_scope === "ORGANIZATION") {
        setValue("branches", []);
      }
    }
    setValue("role", roleId);
  };

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      const payload = { ...data };
      if (!payload.password) {
        delete (payload as any).password;
      }
      return updateUserService(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success("User updated successfully!");
      router.push("/user-management/users");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong. Please try again.");
    },
  });

  async function onSubmit(data: UserFormData) {
    if (
      selectedRoleScope === "BRANCH" &&
      (!data.branches || data.branches.length === 0)
    ) {
      toast.error("Please select at least one branch for this role.");
      return;
    }
    updateMutation.mutate(data);
  }

  if (isLoadingUser || isLoadingOrgs) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="size-10 animate-spin text-zinc-900" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            Retrieving Member Data...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title="Update User Credentials"
          description={
            selectedOrganization
              ? `Modifying user profile within ${selectedOrganization.business_name}.`
              : "Updating user information and access permissions."
          }
          actions={
            <Button
              onClick={() => router.push("/user-management/users")}
              className="flex items-center gap-2 h-10 px-4 border-zinc-200 text-zinc-900 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-50 hover:border-zinc-900 transition-all shadow-none border"
            >
              <ArrowLeft size={14} />
              <span>Back to Registry</span>
            </Button>
          }
        />

        <div className="w-full">
          <div className="rounded-sm border border-zinc-200 bg-white overflow-hidden shadow-none w-full mx-auto">
            <div className="border-b border-zinc-100 bg-zinc-50/30 px-6 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                  Target Context
                </h2>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
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

          <div className="mt-8 rounded-sm border border-zinc-200 bg-white overflow-hidden shadow-none w-full mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="border-b border-zinc-100 bg-zinc-50/30 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm">
                  {selectedOrganization?.business_name || "EDIT"}
                </span>
                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                  User Information for {userResponse?.data?.first_name}{" "}
                  {userResponse?.data?.last_name}
                </h2>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                <UserIcon size={14} />
                              </span>
                              <Input
                                placeholder="John"
                                className="w-full h-11 pl-9 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-zinc-900 text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middle_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Middle Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ray"
                              className="w-full h-11 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-zinc-900 text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              className="w-full h-11 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-zinc-900 text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                <Mail size={14} />
                              </span>
                              <Input
                                type="email"
                                placeholder="member@fitbinary.com"
                                className="w-full h-11 pl-9 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-zinc-900 text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Phone Identifier
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                <Phone size={14} />
                              </span>
                              <Input
                                placeholder="+977"
                                className="w-full h-11 pl-9 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-zinc-900 text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Access Secret (leave blank to keep current)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                <Lock size={14} />
                              </span>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="w-full h-11 pl-9 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-zinc-900 text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Privilege Level
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
                                  <SelectLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2 py-1.5">
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

                  {selectedRoleScope === "BRANCH" && (
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
                              value={field.value}
                              onChange={field.onChange}
                              disabled={isLoadingBranches}
                              placeholder="Bind user to specific branches"
                            />
                          </FormControl>
                          <FormMessage className="text-zinc-900 text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedRoleScope === "ORGANIZATION" && (
                    <div className="bg-zinc-900 text-white rounded-sm p-4 flex items-center gap-3">
                      <Lock className="size-5 text-zinc-400" />
                      <p className="text-[11px] font-medium tracking-tight">
                        <span className="font-black uppercase tracking-widest mr-2">
                          Organization Auth:
                        </span>
                        This member will be granted administrative access across
                        all organizational branches.
                      </p>
                    </div>
                  )}

                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="w-full h-12 bg-zinc-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-sm cursor-pointer shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {updateMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Synchronizing Changes...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save size={18} />
                          Commit Updates
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
