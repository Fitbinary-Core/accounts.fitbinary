"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema, BranchInput } from "@/schemas/branch";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createBranch } from "@/services/branch/branch.service";
import { get_organization_list } from "@/services/organization/organization.service";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Loader2,
  Check,
} from "lucide-react";
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

  const onSubmit = (data: BranchInput) => {
    mutation.mutate(data);
  };

  const organizations = data?.organizations || [];

  if (isLoadingOrgs) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="size-10 animate-spin text-zinc-900" />
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
            Hydrating Organization Data...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title="Branch Configuration"
          description="Defining a new physical node for an organization."
          actions={
            <Button
              onClick={() => router.push("/branches")}
              className="flex items-center gap-2 h-10 px-4 border-zinc-200 text-zinc-900 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-50 hover:border-zinc-900 transition-all shadow-none"
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
                  Branch Specification
                </h2>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 md:p-8 space-y-8"
            >
              {/* Organization Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Target Organization
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
                      placeholder="Search to select an organization..."
                    />
                  )}
                />
                {errors.organization && (
                  <p className="text-red-600 text-[10px] font-bold mt-1">
                    {errors.organization.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Branch Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Branch Identifier
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <Building2 size={14} />
                    </span>
                    <Input
                      {...register("branch_name")}
                      placeholder="e.g. Downtown Office"
                      className={`w-full h-11 pl-9 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none ${errors.branch_name ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.branch_name && (
                    <p className="text-red-600 text-[10px] font-bold mt-1">
                      {errors.branch_name.message}
                    </p>
                  )}
                </div>

                {/* Branch Location */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Geographic Location
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <MapPin size={14} />
                    </span>
                    <Input
                      {...register("branch_location")}
                      placeholder="e.g. 123 Main St, New York"
                      className={`w-full h-11 pl-9 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none ${errors.branch_location ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.branch_location && (
                    <p className="text-red-600 text-[10px] font-bold mt-1">
                      {errors.branch_location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Branch Type */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Infrastructure Type
                </label>
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
                  <p className="text-red-600 text-[10px] font-bold mt-1">
                    {errors.branch_type.message}
                  </p>
                )}
              </div>

              {/* Main Branch Toggle */}
              <div className="flex items-center gap-2 py-2">
                <Controller
                  name="is_main"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        "flex items-center gap-2 p-2 px-3 rounded-sm border transition-all duration-200",
                        field.value
                          ? "bg-zinc-900 border-zinc-900 text-white"
                          : "bg-white border-zinc-200 text-zinc-500",
                      )}
                    >
                      <div
                        className={cn(
                          "size-4 rounded-sm border flex items-center justify-center transition-colors",
                          field.value
                            ? "bg-white border-white text-zinc-900"
                            : "border-zinc-300",
                        )}
                      >
                        {field.value && <Check size={12} strokeWidth={4} />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Mark as Main Branch
                      </span>
                    </button>
                  )}
                />
              </div>

              <div className="pt-6 flex gap-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending || isSubmitting}
                  className="flex-1 h-12 bg-zinc-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-sm cursor-pointer shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {mutation.isPending || isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Provisioning...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={18} />
                      Save Branch Node
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
