"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData } from "@/schemas/user";
import { createUserService } from "@/services/users/user.service";
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
  UserPlus,
  Mail,
  Phone,
  Lock,
  User,
  Loader2,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyBranches } from "@/services/branch/branch.service";
import { get_all_apps } from "@/services/apps/apps.service";
import BranchSelector from "@/components/common/BranchSelector";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useState, useEffect } from "react";
import { IApplication } from "@/types/apps";
import {
  get_user_roles_list,
  type Role,
} from "@/services/roles/roles.services";

export default function AddUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<IApplication | null>(null);
  const [selectedRoleScope, setSelectedRoleScope] = useState<
    "ORGANIZATION" | "BRANCH" | null
  >(null);

  const queryClient = useQueryClient();

  const { data: appsData, isLoading: isLoadingApps } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
    staleTime: 1000 * 60 * 60 * 10,
  });

  const { data: roles } = useQuery({
    queryKey: ["user-roles", selectedApp?._id],
    queryFn: () => get_user_roles_list(selectedApp?._id),
    enabled: !!selectedApp,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-branches"],
    queryFn: () => getMyBranches(),
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
      app: "",
      branches: [],
    },
  });

  useEffect(() => {
    if (selectedApp) {
      form.setValue("app", selectedApp._id);
    }
  }, [selectedApp, form]);

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles?.data.find((r: Role) => r._id === roleId);
    if (selectedRole) {
      setSelectedRoleScope(selectedRole.role_scope || "BRANCH");
      if (selectedRole.role_scope === "ORGANIZATION") {
        form.setValue("branches", []);
      }
    }
    form.setValue("role", roleId);
  };

  async function onSubmit(data: UserFormData) {
    if (
      selectedRoleScope === "BRANCH" &&
      (!data.branches || data.branches.length === 0)
    ) {
      toast.error("Please select at least one branch for this role.");
      return;
    }

    setLoading(true);
    console.log("Submitting user data:", JSON.stringify(data, null, 2));
    try {
      await createUserService(data);
      toast.success("User created successfully!");
      router.push("/user-management/users");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const applications = appsData?.applications || [];

  if (isLoadingApps) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="size-10 animate-spin text-zinc-900" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            Hydrating Application Data...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title={selectedApp ? "Register New Member" : "Application Context"}
          description={
            selectedApp
              ? `Creating a new user profile within ${selectedApp.name}.`
              : "Select an application environment to begin user onboarding."
          }
          actions={
            <Button
              onClick={() =>
                selectedApp
                  ? setSelectedApp(null)
                  : router.push("/user-management/users")
              }
              className="flex items-center gap-2 h-10 px-4 border-zinc-200 text-zinc-900 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-50 hover:border-zinc-900 transition-all shadow-none"
            >
              <ArrowLeft size={14} />
              <span>
                {selectedApp ? "Change Environment" : "Back to Registry"}
              </span>
            </Button>
          }
        />

        <div className="w-full">
          {!selectedApp ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <button
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className="group relative bg-white border border-zinc-200 rounded-sm p-6 text-left transition-all hover:border-zinc-900 hover:shadow-sm active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 rounded-sm bg-zinc-900 flex items-center justify-center text-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-zinc-900 text-base tracking-tight">
                        {app.name}
                      </h3>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest border border-zinc-100 px-1.5 py-0.5 rounded-sm">
                        {app.app_slug}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-2">
                    {app.description ||
                      "Deploy new user credentials to this application node."}
                  </p>
                  <div className="mt-4 flex items-center text-zinc-900 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Initialize Setup →
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-zinc-200 bg-white overflow-hidden shadow-none w-full mx-auto">
              <div className="border-b border-zinc-100 bg-zinc-50/30 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm">
                    {selectedApp.app_slug}
                  </span>
                  <h2 className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                    User Credentials
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
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                                  <User size={14} />
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
                        render={({ field }: any) => (
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
                        render={({ field }: any) => (
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
                        render={({ field }: any) => (
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
                        render={({ field }: any) => (
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
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                              Access Secret
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
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                              Privilege Level
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={handleRoleChange}
                                defaultValue={field.value}
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
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                              Resource Access Tags (Branches)
                            </FormLabel>
                            <FormControl>
                              <BranchSelector
                                multi={true}
                                branches={
                                  data?.data.filter(
                                    (b: any) =>
                                      b.application === selectedApp?._id,
                                  ) || []
                                }
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isLoading}
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
                          This member will be granted administrative access
                          across all organizational branches.
                        </p>
                      </div>
                    )}

                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-zinc-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-sm cursor-pointer shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Finalizing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus size={18} />
                            Create User Account
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
