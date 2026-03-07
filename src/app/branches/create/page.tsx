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
    staleTime: 1000 * 60 * 60 * 4,
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
          <Loader2 className="size-10 animate-spin text-zinc-900" />
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
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
          title={selectedApp ? "Node Configuration" : "Selection Context"}
          description={
            selectedApp
              ? `Defining a new physical node for ${selectedApp.name}.`
              : "Choose an application environment to provision the new branch."
          }
          actions={
            <Button
              onClick={() =>
                selectedApp ? setSelectedApp(null) : router.push("/branches")
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
                      <Building2 size={24} />
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
                      "Deploy a new physical branch to this application node."}
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
                    Branch Specification
                  </h2>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 md:p-8 space-y-6"
              >
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
                      <p className="text-zinc-900 text-[10px] font-bold mt-1">
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
                      <p className="text-zinc-900 text-[10px] font-bold mt-1">
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
                    <p className="text-zinc-900 text-[10px] font-bold mt-1">
                      {errors.branch_type.message}
                    </p>
                  )}
                </div>

                <div className="pt-6 flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 h-12 border-zinc-200 text-zinc-900 text-[11px] font-black uppercase tracking-widest rounded-sm hover:bg-zinc-50 hover:border-zinc-400 transition-all shadow-none"
                  >
                    Reselect App
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutation.isPending || isSubmitting}
                    className="flex-2 h-12 bg-zinc-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-sm cursor-pointer shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
