"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema, BranchInput } from "@/schemas/branch";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createBranch } from "@/services/branch/branch.service";
import { get_all_apps } from "@/services/apps/apps.service";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Building2, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import BranchTypeSelector from "@/components/common/BranchTypeSelector";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useState, useEffect } from "react";
import { IApplication } from "@/types/apps";

export default function AddBranchPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<IApplication | null>(null);

  const { data: appsData, isLoading: isLoadingApps } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BranchInput>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      branch_name: "",
      branch_location: "",
      branch_type: "Retail Store",
      application: "",
    },
  });

  useEffect(() => {
    if (selectedApp) {
      setValue("application", selectedApp._id);
    }
  }, [selectedApp, setValue]);

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

  const applications = appsData?.applications || [];

  if (isLoadingApps) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="size-12 border-4 border-zinc-100 border-t-brand-red rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
            Loading Applications...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-50/30 min-h-full">
        <DashboardBreadcrumb
          title={selectedApp ? "Branch Details" : "Select Application"}
          description={
            selectedApp
              ? `Creating branch for ${selectedApp.name}`
              : "Choose an application to associate with this branch."
          }
          actions={
            <Button
              onClick={() =>
                selectedApp ? setSelectedApp(null) : router.push("/branches")
              }
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-5.5 rounded-sm transition-all border-none cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{selectedApp ? "Back" : "Cancel"}</span>
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
                    {app.description || "Create branch for this application."}
                  </p>
                  <div className="mt-4 flex items-center text-red-600 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Select App →
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-md border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden w-full mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
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
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 cursor-pointer py-5.5 rounded-sm border-gray-200 text-gray-600 hover:bg-gray-500 hover:text-white font-semibold"
                  >
                    Change App
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutation.isPending || isSubmitting}
                    className="flex-1 cursor-pointer py-5.5 rounded-sm bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
