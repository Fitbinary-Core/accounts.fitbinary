"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MapPin, Navigation, Save, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { branchSchema, BranchInput } from "@/schemas/branch";
import { create_update_main_branch } from "@/services/onboarding/onboarding.service";
import { BranchDetailsProps } from "@/schemas/onboarding";

const BranchSetup = ({
  branch_details,
  onStepComplete,
}: BranchDetailsProps & { onStepComplete?: () => void }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BranchInput>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      branch_name: branch_details?.main_branch?.branch_name || "",
      branch_location: branch_details?.main_branch?.branch_location || "",
      branch_type: "Head Office" as any,
      is_main: true,
    },
  });

  const onSubmit: SubmitHandler<BranchInput> = async (data) => {
    try {
      setLoading(true);
      const response = await create_update_main_branch({
        ...data,
        is_main: true,
      });
      toast.success(response.message || "Main branch processed successfully");
      if (onStepComplete) {
        onStepComplete();
      }
      if (onStepComplete) {
        onStepComplete();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to setup branch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <Building2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Main Branch Configuration
          </h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md">
          Create your first main branch. This will be your primary location
          where your business operations start.
        </p>
        <div className="h-0.5 w-16 bg-red-500 rounded-full" />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          {/* Branch Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              Branch Name
            </label>
            <Input
              placeholder="e.g. Fitbinary High-Street Gym"
              className="bg-gray-50 text-gray-800 border-gray-200 focus:border-red-500 focus:ring-red-500 h-12 rounded-lg transition-all"
              {...register("branch_name")}
            />
            {errors.branch_name && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.branch_name.message}
              </p>
            )}
          </div>

          {/* Branch Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Physical Address
            </label>
            <Input
              placeholder="e.g. 123 Fitness Ave, Wellness District"
              className="bg-gray-50 text-gray-800 border-gray-200 focus:border-red-500 focus:ring-red-500 h-12 rounded-lg transition-all"
              {...register("branch_location")}
            />
            {errors.branch_location && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.branch_location.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full py-5.5 rounded-sm cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200/50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Configuring...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Initialize Main Branch
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BranchSetup;
