"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { BusinessDetailsProps } from "@/schemas/onboarding";
import { update_business_details } from "@/services/onboarding/onboarding.service";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/common/ImageUploader";
import { getLogoPresignedUrl } from "@/services/onboarding/onboarding.service";
import { v4 as uuidv4 } from "uuid";
import CustomSelector, {
  SelectOption,
} from "@/components/common/CustomSelector";
import { useMemo, useState } from "react";

// Zod schema
const businessDetailsSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_logo: z.string().optional(),
  business_description: z.string().optional(),
  business_type: z.string().optional(),
  business_size: z.string().optional(),
  business_email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  business_phone: z.string().optional(),
});

// Type
type BusinessDetailsFormData = z.infer<typeof businessDetailsSchema>;

const BusinessDetails = ({
  business_details,
  selectedApp,
  onStepComplete,
}: BusinessDetailsProps & {
  selectedApp?: any;
  onStepComplete?: () => void;
}) => {
  const { business_details: bd, onboarding_fields_data } =
    business_details || [];
  const { business } = bd || [];

  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<BusinessDetailsFormData>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      business_name: business?.business_name || "",
      business_logo: business?.business_logo || "",
      business_description: business?.business_description || "",
      business_type: business?.business_type || "",
      business_size: business?.business_size || "",
      business_email: business?.business_email || "",
      business_phone: business?.business_phone || "",
    },
  });

  const businessType = watch("business_type");
  const businessSize = watch("business_size");

  const businessTypeOptions: SelectOption[] = useMemo(() => {
    return (onboarding_fields_data?.business_details?.businessTypes || []).map(
      (type: any) => ({
        value: type.key,
        label: type.label,
        description: type.description,
      }),
    );
  }, [onboarding_fields_data]);

  const businessSizeOptions: SelectOption[] = useMemo(() => {
    return (onboarding_fields_data?.business_details?.businessSizes || []).map(
      (size: any) => ({
        value: size.key,
        label: size.label,
        description: size.description,
      }),
    );
  }, [onboarding_fields_data]);

  const onSubmit = async (data: BusinessDetailsFormData) => {
    try {
      let logoUrl = data.business_logo;

      if (files.length > 0) {
        setUploadStatus("Uploading logo...");
        const file = files[0];
        const fileExtension = file.name.split(".").pop();
        const uniqueKey = `${uuidv4()}.${fileExtension}`;

        const presignedData = await getLogoPresignedUrl(uniqueKey);

        const uploadResponse = await fetch(presignedData.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error("Logo upload failed");
        }

        logoUrl = presignedData.url.split("?")[0];
      }

      setUploadStatus("Saving details...");
      const response = await update_business_details({
        ...data,
        business_logo: logoUrl || "",
        app_id: selectedApp?._id,
      } as any);
      toast.success(
        response?.message || "Business details updated successfully",
      );
      if (onStepComplete) {
        setTimeout(() => {
          onStepComplete();
        }, 500);
      }
    } catch (error: any) {
      console.error("Error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setUploadStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Business Name <span className="text-red-600">*</span>
        </label>
        <input
          {...register("business_name")}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-800 bg-white"
          placeholder="Enter your business name"
        />
        {errors.business_name && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <span className="text-xs">⚠</span> {errors.business_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Business Logo
        </label>
        {business?.business_logo && files.length === 0 && (
          <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={business.business_logo}
              alt="Current Business Logo"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <ImageUploader
          value={files}
          onChange={setFiles}
          isMulti={false}
          maxFiles={1}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Business Description <span className="text-red-600">*</span>
        </label>
        <textarea
          {...register("business_description")}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-800 bg-white resize-none"
          rows={4}
          placeholder="Describe your business..."
        />
        {errors.business_description && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <span className="text-xs">⚠</span>{" "}
            {errors.business_description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelector
          label="Business Type"
          required
          options={businessTypeOptions}
          value={businessType || ""}
          onChange={(value) => setValue("business_type", value)}
          placeholder="Select business type"
          searchPlaceholder="Search business types..."
          error={errors.business_type?.message}
        />

        <CustomSelector
          label="Business Size"
          required
          options={businessSizeOptions}
          value={businessSize || ""}
          onChange={(value) => setValue("business_size", value)}
          placeholder="Select business size"
          searchPlaceholder="Search business sizes..."
          error={errors.business_size?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Email <span className="text-red-600">*</span>
          </label>
          <input
            {...register("business_email")}
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-800 bg-white"
            placeholder="business@example.com"
          />
          {errors.business_email && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span className="text-xs">⚠</span> {errors.business_email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Phone <span className="text-red-600">*</span>
          </label>
          <input
            {...register("business_phone")}
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-800 bg-white"
            placeholder="+1 (555) 000-0000"
          />
          {errors.business_phone && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span className="text-xs">⚠</span> {errors.business_phone.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !!uploadStatus}
        className="cursor-pointer w-full py-5.5 rounded-sm bg-red-600 hover:bg-red-700 text-white transition-all font-semibold text-base shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting || !!uploadStatus ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            {uploadStatus || "Saving..."}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Save Business Details
          </span>
        )}
      </Button>
    </form>
  );
};

export default BusinessDetails;
