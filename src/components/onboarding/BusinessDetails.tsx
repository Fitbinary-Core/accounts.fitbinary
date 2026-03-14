"use client";

import { Plus, Upload, Save, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerificationDocument } from "@/schemas/onboarding";
import {
  getBusinessDocumentsPresignedUrl,
  getLogoPresignedUrl,
  update_business_details,
} from "@/services/onboarding/onboarding.service";
import { Button } from "@/components/ui/button";
import CustomSelector from "@/components/common/CustomSelector";
import { SelectOption } from "@/components/common/CustomSelector";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import ImageUploader from "@/components/common/ImageUploader";
import DocumentUploader from "@/components/common/DocumentUploader";
import { v4 as uuidv4 } from "uuid";
import {
  BusinessDetailsFormData,
  businessDetailsSchema,
} from "@/schemas/business.details";

const BusinessDetails = ({
  business_details,
  selectedApp,
  onStepComplete,
}: {
  business_details: any;
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
      registration_status:
        business?.registration_status ||
        (business?.is_registered ? "REGISTERED" : "UNDER_REGISTRATION"),
      is_registered: business?.is_registered || false,
      registration_number:
        business?.verification_documents?.find(
          (d: any) => d.document_type === "REGISTRATION",
        )?.document_number || "",
      has_pan:
        business?.has_pan ||
        !!business?.verification_documents?.some(
          (d: any) => d.document_type === "PAN",
        ),
      pan_number:
        business?.verification_documents?.find(
          (d: any) => d.document_type === "PAN",
        )?.document_number || "",
      is_vat_registered:
        business?.is_vat_registered ||
        !!business?.verification_documents?.some(
          (d: any) => d.document_type === "VAT",
        ),
      vat_number:
        business?.verification_documents?.find(
          (d: any) => d.document_type === "VAT",
        )?.document_number || "",
      verification_documents: business?.verification_documents || [],
    },
  });

  const businessType = watch("business_type");
  const businessSize = watch("business_size");

  const updateDoc = (
    type: string,
    doc: Partial<VerificationDocument> & { _file?: File },
  ) => {
    const currentDocs = watch("verification_documents") || [];
    const index = currentDocs.findIndex((d) => d.document_type === type);

    const newDoc = {
      document_type: type,
      document_number: doc.document_number || "",
      document_photo: doc.document_photo || "",
      _file: doc._file,
    };

    if (index > -1) {
      const updated = [...currentDocs];
      updated[index] = newDoc;
      setValue("verification_documents", updated);
    } else {
      setValue("verification_documents", [...currentDocs, newDoc]);
    }
  };

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

      setUploadStatus("Preparing documents...");

      const businessTypeMapping: Record<string, string> = {
        FITNESS_GYM: "FITNESS",
        SUPPLEMENT_STORE: "SUPPLEMENT STORE",
      };

      const finalBusinessType =
        businessTypeMapping[data.business_type || ""] || data.business_type;

      const {
        registration_number,
        pan_number,
        vat_number,
        registration_status,
        is_registered,
        has_pan,
        is_vat_registered,
        verification_documents,
        ...payloadBase
      } = data;

      const finalDocs: any[] = [];

      if (is_registered) {
        const docsToProcess = [];

        if (registration_number) {
          docsToProcess.push({
            document_type: "REGISTRATION",
            document_number: registration_number,
            doc: verification_documents.find(
              (d) => d.document_type === "REGISTRATION",
            ),
          });
        }

        if (has_pan && pan_number) {
          docsToProcess.push({
            document_type: "PAN",
            document_number: pan_number,
            doc: verification_documents.find((d) => d.document_type === "PAN"),
          });
        }

        if (is_vat_registered && vat_number) {
          docsToProcess.push({
            document_type: "VAT",
            document_number: vat_number,
            doc: verification_documents.find((d) => d.document_type === "VAT"),
          });
        }

        for (const item of docsToProcess) {
          let photoUrl = item.doc?.document_photo || "";

          if (item.doc?._file) {
            setUploadStatus(`Uploading ${item.document_type} document...`);
            const file = item.doc._file;
            const fileExtension = file.name.split(".").pop();
            const uniqueKey = `${uuidv4()}.${fileExtension}`;

            const presignedData =
              await getBusinessDocumentsPresignedUrl(uniqueKey);

            const uploadResponse = await fetch(presignedData.url, {
              method: "PUT",
              headers: {
                "Content-Type": file.type,
              },
              body: file,
            });

            if (!uploadResponse.ok) {
              throw new Error(`${item.document_type} upload failed`);
            }

            photoUrl = presignedData.url.split("?")[0];
          }

          finalDocs.push({
            document_type: item.document_type,
            document_number: item.document_number,
            document_photo: photoUrl,
          });
        }
      }

      setUploadStatus("Saving business details...");

      const response = await update_business_details({
        ...payloadBase,
        is_registered,
        business_type: finalBusinessType || "",
        business_logo: logoUrl || "",
        app_id: selectedApp?._id,
        verification_documents: finalDocs,
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

      <div className="space-y-8 pt-6 border-t border-gray-100">
        {/* Business Registration Status Tabs */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-tight">
            Business Registration Status
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setValue("registration_status", "REGISTERED");
                setValue("is_registered", true);
              }}
              className={cn(
                "relative p-5 rounded-lg border-2 text-left cursor-pointer transition-all duration-300 group hover:shadow-md",
                watch("registration_status") === "REGISTERED"
                  ? "border-red-600 bg-red-50/30"
                  : "border-gray-100 bg-white hover:border-gray-200",
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    watch("registration_status") === "REGISTERED"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200",
                  )}
                >
                  <Check className="w-6 h-6 border-2 border-current rounded-full p-1" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">
                    Registered
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    My business is officially registered
                  </p>
                </div>
              </div>
              {watch("registration_status") === "REGISTERED" && (
                <div className="absolute top-4 right-4 text-red-600">
                  <div className="bg-red-600 text-white p-1 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("registration_status", "UNDER_REGISTRATION");
                setValue("is_registered", false);
              }}
              className={cn(
                "relative p-5 rounded-lg border-2 text-left cursor-pointer transition-all duration-300 group hover:shadow-md",
                watch("registration_status") === "UNDER_REGISTRATION"
                  ? "border-red-600 bg-red-50/30"
                  : "border-gray-100 bg-white hover:border-gray-200",
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    watch("registration_status") === "UNDER_REGISTRATION"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200",
                  )}
                >
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">
                    Under Registration
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    My business registration is in process
                  </p>
                </div>
              </div>
              {watch("registration_status") === "UNDER_REGISTRATION" && (
                <div className="absolute top-4 right-4 text-red-600">
                  <div className="bg-red-600 text-white p-1 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>

        {watch("registration_status") === "REGISTERED" ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* 1. Business Registration Details */}
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Registration Details
                </h3>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("registration_number")}
                    className={cn(
                      "w-full px-4 py-3 border rounded-md focus:ring-2 outline-none text-gray-800 transition-all",
                      errors.registration_number
                        ? "border-red-500 focus:ring-red-500 bg-red-50/10"
                        : "border-gray-300 focus:ring-red-500",
                    )}
                    placeholder="Enter registration number"
                  />
                  {errors.registration_number && (
                    <p className="text-red-600 text-xs mt-1 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                      <span>⚠</span> {errors.registration_number.message}
                    </p>
                  )}
                </div>
                <DocumentUploader
                  label={
                    watch("is_registered")
                      ? "Registration Document"
                      : "Registration Document (optional)"
                  }
                  type="REGISTRATION"
                  value={watch("verification_documents")?.find(
                    (d) => d.document_type === "REGISTRATION",
                  )}
                  onChange={(doc) => updateDoc("REGISTRATION", doc)}
                />
              </div>
            </div>

            {/* 2. PAN */}
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    PAN (Permanent Account Number)
                  </h3>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setValue("has_pan", true)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
                      watch("has_pan")
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("has_pan", false)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
                      !watch("has_pan")
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    No
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 font-medium">
                Tax identity number
              </p>

              {watch("has_pan") && (
                <div className="space-y-4 pt-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      PAN Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      {...register("pan_number")}
                      className={cn(
                        "w-full px-4 py-3 border rounded-md focus:ring-2 outline-none text-gray-800 transition-all",
                        errors.pan_number
                          ? "border-red-500 focus:ring-red-500 bg-red-50/10"
                          : "border-gray-300 focus:ring-red-500",
                      )}
                      placeholder="Enter PAN number"
                    />
                    {errors.pan_number && (
                      <p className="text-red-600 text-xs mt-1 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <span>⚠</span> {errors.pan_number.message}
                      </p>
                    )}
                  </div>
                  <DocumentUploader
                    label={
                      watch("is_registered")
                        ? "PAN Document"
                        : "PAN Document (optional)"
                    }
                    type="PAN"
                    value={watch("verification_documents")?.find(
                      (d) => d.document_type === "PAN",
                    )}
                    onChange={(doc) => updateDoc("PAN", doc)}
                  />
                </div>
              )}
            </div>

            {/* 3. VAT */}
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    VAT (Value Added Tax)
                  </h3>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setValue("is_vat_registered", true)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
                      watch("is_vat_registered")
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("is_vat_registered", false)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
                      !watch("is_vat_registered")
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    No
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 font-medium">
                Allows charging 13% tax on bills
              </p>

              {watch("is_vat_registered") && (
                <div className="space-y-4 pt-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      VAT Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      {...register("vat_number")}
                      className={cn(
                        "w-full px-4 py-3 border rounded-md focus:ring-2 outline-none text-gray-800 transition-all",
                        errors.vat_number
                          ? "border-red-500 focus:ring-red-500 bg-red-50/10"
                          : "border-gray-300 focus:ring-red-500",
                      )}
                      placeholder="Enter VAT number"
                    />
                    {errors.vat_number && (
                      <p className="text-red-600 text-xs mt-1 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <span>⚠</span> {errors.vat_number.message}
                      </p>
                    )}
                  </div>
                  <DocumentUploader
                    label={
                      watch("is_registered")
                        ? "VAT Document"
                        : "VAT Document (optional)"
                    }
                    type="VAT"
                    value={watch("verification_documents")?.find(
                      (d) => d.document_type === "VAT",
                    )}
                    onChange={(doc) => updateDoc("VAT", doc)}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-400">
              <Upload className="w-8 h-8" />
            </div>
            <div className="max-w-xs">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Documentation Later
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-2">
                Since your business is under process, you can upload your
                verification documents later from the settings panel.
              </p>
            </div>
          </div>
        )}
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
