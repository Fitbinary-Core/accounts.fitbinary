"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema, BranchInput } from "@/schemas/branch";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createBranch } from "@/services/branch/branch.service";
import { get_organization_list } from "@/services/organization/organization.service";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Building2, MapPin, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import BranchTypeSelector from "@/components/common/BranchTypeSelector";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { DashboardLayout } from "@/components/dashboard/Layout";
import OrganizationSelector from "@/components/common/OrganizationSelector";
import { cn } from "@/lib/utils";

export default function AddBranchPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingOrgs } = useQuery({
    queryKey: ["organization-list"],
    queryFn: () => get_organization_list(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BranchInput>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      branch_name: "",
      branch_location: "",
      branch_type: "Branch Office",
      organization: "",
      is_main: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BranchInput) => createBranch(data),
    onSuccess: (res) => {
      toast.success(res.message || "Branch created successfully");
      queryClient.invalidateQueries({ queryKey: ["my-branches"] });
      router.push("/branches");
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const onSubmit = (data: BranchInput) => mutation.mutate(data);
  const organizations = data?.organizations || [];

  if (isLoadingOrgs) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 className="size-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading organizations...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DashboardBreadcrumb
          title="Add Branch"
          description="Create a new branch location for your organization."
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/branches")}
              className="flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-md"
            >
              <ArrowLeft size={14} />
              Back to Branches
            </Button>
          }
        />

        <div className="max-w-full">
          <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
              <h2 className="text-sm font-semibold text-zinc-900">Branch Details</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Fill in the information about the new branch.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Organization */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Organization <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="organization"
                  control={control}
                  render={({ field }) => (
                    <OrganizationSelector
                      organizations={organizations}
                      multi={false}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={mutation.isPending || isSubmitting}
                      placeholder="Select an organization..."
                    />
                  )}
                />
                {errors.organization && (
                  <p className="text-red-500 text-xs mt-1">{errors.organization.message}</p>
                )}
              </div>

              {/* Branch Name & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <Building2 size={14} />
                    </span>
                    <Input
                      {...register("branch_name")}
                      placeholder="e.g. Kathmandu Downtown"
                      className={cn(
                        "h-10 pl-9 text-sm rounded-md border-zinc-200",
                        errors.branch_name && "border-red-400 focus-visible:ring-red-300"
                      )}
                    />
                  </div>
                  {errors.branch_name && (
                    <p className="text-red-500 text-xs">{errors.branch_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <MapPin size={14} />
                    </span>
                    <Input
                      {...register("branch_location")}
                      placeholder="e.g. Mid Baneshwor, Kathmandu"
                      className={cn(
                        "h-10 pl-9 text-sm rounded-md border-zinc-200",
                        errors.branch_location && "border-red-400 focus-visible:ring-red-300"
                      )}
                    />
                  </div>
                  {errors.branch_location && (
                    <p className="text-red-500 text-xs">{errors.branch_location.message}</p>
                  )}
                </div>
              </div>

              {/* Branch Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">Branch Type</label>
                <Controller
                  name="branch_type"
                  control={control}
                  render={({ field }) => (
                    <BranchTypeSelector
                      value={field.value}
                      onChange={field.onChange}
                      disabled={mutation.isPending || isSubmitting}
                    />
                  )}
                />
                {errors.branch_type && (
                  <p className="text-red-500 text-xs">{errors.branch_type.message}</p>
                )}
              </div>

              {/* Main Branch Toggle */}
              <Controller
                name="is_main"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left",
                      field.value
                        ? "bg-amber-50 border-amber-300"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    <div
                      className={cn(
                        "size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        field.value ? "bg-amber-100" : "bg-zinc-100"
                      )}
                    >
                      <Star
                        size={16}
                        className={field.value ? "text-amber-600 fill-amber-500" : "text-zinc-400"}
                      />
                    </div>
                    <div>
                      <p className={cn("text-sm font-semibold", field.value ? "text-amber-800" : "text-zinc-700")}>
                        Set as Main Branch
                      </p>
                      <p className={cn("text-xs mt-0.5", field.value ? "text-amber-600" : "text-zinc-400")}>
                        The primary headquarters of your organization
                      </p>
                    </div>
                    <div
                      className={cn(
                        "ml-auto size-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                        field.value ? "border-amber-500 bg-amber-500" : "border-zinc-300"
                      )}
                    >
                      {field.value && (
                        <div className="size-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                )}
              />

              {/* Submit */}
              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/branches")}
                  className="h-10 px-5 text-sm font-medium rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending || isSubmitting}
                  className="flex-1 h-10 bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-md cursor-pointer shadow-sm transition-all disabled:opacity-50"
                >
                  {mutation.isPending || isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={15} />
                      Create Branch
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
