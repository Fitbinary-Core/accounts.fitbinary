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
  });

  const { data: roles } = useQuery({
    queryKey: ["user-roles", selectedApp?._id],
    queryFn: () => get_user_roles_list(selectedApp?._id),
    enabled: !!selectedApp,
  });

  console.log("Roles: ", roles);

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
      router.push("/user-management");
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
          <div className="size-12 border-4 border-zinc-100 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
            Loading Applications...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-gray-50/30">
        <DashboardBreadcrumb
          title={selectedApp ? "Add New User" : "Select Application"}
          description={
            selectedApp
              ? `Register a new member for ${selectedApp.name}.`
              : "Choose an application to register the user for."
          }
          actions={
            <Button
              onClick={() =>
                selectedApp
                  ? setSelectedApp(null)
                  : router.push("/user-management/users")
              }
              className="flex items-center bg-red-600 hover:bg-red-700 text-white cursor-pointer gap-2 px-5 py-5.5 rounded-sm transition-all  border-none"
            >
              <ArrowLeft size={16} />
              <span>{selectedApp ? "Change App" : "Back to Users"}</span>
            </Button>
          }
        />

        <div className="mx-auto w-full">
          {!selectedApp ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <button
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className="group relative bg-white border border-gray-100 rounded-xl p-6 text-left transition-all hover:shadow-xl hover:cursor-pointer hover:border-red-600/20 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-14 rounded-full bg-gray-50 flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-110 transition-transform border border-gray-100">
                      <img
                        src="/Icon.png"
                        alt={app.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors text-lg">
                        {app.name}
                      </h3>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-full">
                        {app.app_slug}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {app.description || "Register user for this application."}
                  </p>
                  <div className="mt-4 flex items-center text-red-600 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Select App →
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Form Container */
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 md:px-8">
                <h2 className="text-lg font-bold text-gray-800">
                  User Information for {selectedApp.name}
                </h2>
              </div>

              <div className="p-6 md:p-10">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {/* Name Section */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-gray-700">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
                                  <User size={18} />
                                </span>
                                <Input
                                  placeholder="John"
                                  className="w-full h-12 pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 rounded-lg shadow-sm"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-600 font-medium" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="middle_name"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-gray-700">
                              Middle Name (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ray"
                                className="w-full h-12 border-gray-300 focus:border-red-500 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 rounded-lg shadow-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-600 font-medium" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-gray-700">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                className="w-full h-12 border-gray-300 focus:border-red-500 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 rounded-lg shadow-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-600 font-medium" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Section */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-gray-700">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
                                  <Mail size={18} />
                                </span>
                                <Input
                                  type="email"
                                  placeholder="john.doe@example.com"
                                  className="w-full h-12 pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 rounded-lg shadow-sm"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-600 font-medium" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-gray-700">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
                                  <Phone size={18} />
                                </span>
                                <Input
                                  placeholder="+1 (555) 000-0000"
                                  className="w-full h-12 pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 rounded-lg shadow-sm"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-600 font-medium" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Security Section */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-gray-700">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
                                  <Lock size={18} />
                                </span>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full h-12 pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 rounded-lg shadow-sm"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-600 font-medium" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-gray-700">
                              User Role
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={handleRoleChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full py-5.5 border-gray-300 focus:border-red-500 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-600 rounded-sm shadow-sm">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200">
                                  <SelectGroup>
                                    <SelectLabel className="text-gray-700">
                                      Available Roles
                                    </SelectLabel>
                                    {roles ? (
                                      roles.data.map((role: any) => (
                                        <SelectItem
                                          key={role._id}
                                          value={role._id}
                                          className="cursor-pointer text-gray-800 hover:bg-red-50 transition-colors py-3 rounded-sm"
                                        >
                                          {role.role_name}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                                      </div>
                                    )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-red-600 font-medium" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Branches */}
                    {selectedRoleScope === "BRANCH" && (
                      <FormField
                        control={form.control}
                        name="branches"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-gray-700">
                              Assign branches to user *
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
                                placeholder="Search and select branches..."
                              />
                            </FormControl>
                            <FormMessage className="text-red-600 font-medium" />
                          </FormItem>
                        )}
                      />
                    )}

                    {selectedRoleScope === "ORGANIZATION" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <span className="font-bold">
                            Organization-level role:
                          </span>{" "}
                          This user will have access to all branches in the
                          organization.
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5.5 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-sm cursor-pointer shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating User account...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus size={22} />
                            Register New User
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
