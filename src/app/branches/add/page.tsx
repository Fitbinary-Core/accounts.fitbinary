"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema, BranchInput } from "@/schemas/branch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "@/services/branch/branch.service";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Building2, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import BranchTypeSelector from "@/components/common/BranchTypeSelector";

import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";

export default function AddBranchPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      branch_type: "Retail Store",
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

  return (
    <div className="bg-gray-50/30 min-h-full">
      <DashboardBreadcrumb
        title="Add New Branch"
        description="Enter the details of your business location."
        icon={Building2}
        items={[{ label: "Branches" }, { label: "Add" }]}
        actions={
          <Button
            onClick={() => router.push("/branches")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-5.5 rounded-sm transition-all shadow-md shadow-red-200 border-none cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Button>
        }
      />

      <div className="p-4 mx-auto w-full">
        <div className="bg-white rounded-md border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-4 space-y-4"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Branch Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Branch Name
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("branch_name")}
                    placeholder="e.g. Downtown Office"
                    className={`pl-10 py-5.5 rounded-sm border-gray-200 focus:border-red-500 focus:ring-red-500 text-gray-800 ${errors.branch_name ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.branch_name && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.branch_name.message}
                  </p>
                )}
              </div>

              {/* Branch Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Location Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("branch_location")}
                    placeholder="e.g. 123 Main St, New York"
                    className={`pl-10 py-5.5 rounded-sm border-gray-200 focus:border-red-500 focus:ring-red-500 text-gray-800 ${errors.branch_location ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.branch_location && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.branch_location.message}
                  </p>
                )}
              </div>

              {/* Branch Type */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Branch Type
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
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.branch_type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button
                type="button"
                onClick={() => router.push("/branches")}
                className="flex-1 cursor-pointer py-5.5 rounded-sm border-gray-200 text-gray-600 hover:bg-gray-500 hover:text-white font-semibold"
              >
                <ArrowLeft size={20} />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending || isSubmitting}
                className="flex-1 cursor-pointer py-5.5 rounded-sm bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-200"
              >
                {mutation.isPending || isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                <span>Save Branch</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
