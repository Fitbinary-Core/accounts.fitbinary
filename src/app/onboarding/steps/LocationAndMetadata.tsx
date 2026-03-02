"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocationAndMetaDataProps } from "@/schemas/onboarding";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { update_location_and_metadata } from "@/services/onboarding/onboarding.service";
import toast from "react-hot-toast";
import CustomSelector, {
    SelectOption,
} from "@/components/common/CustomSelector";
import { useMemo } from "react";

// Zod schema
const businessDetailsSchema = z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    municipality: z.string().min(1, "Municipality is required"),
    location: z.string().min(1, "Location is required"),
    landmark: z.string().min(1, "Landmark is required"),
    timezone: z.string().min(1, "Timezone is required"),
    currency: z.string().min(1, "Currency is required"),
});

// Type
type BusinessDetailsFormData = z.infer<typeof businessDetailsSchema>;

const LocationAndMetadata = ({
    location_and_metadata,
    onStepComplete,
}: LocationAndMetaDataProps & { onStepComplete?: () => void }) => {
    const { location_and_metadata_details, onboarding_fields_data } =
        location_and_metadata;
    const { location_and_metadata: lam } = location_and_metadata_details;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { isSubmitting, errors },
    } = useForm<BusinessDetailsFormData>({
        resolver: zodResolver(businessDetailsSchema),
        defaultValues: {
            country: lam?.country || "",
            state: lam?.state || "",
            district: lam?.district || "",
            municipality: lam?.municipality || "",
            location: lam?.location || "",
            landmark: lam?.landmark || "",
            timezone: lam?.timezone || "",
            currency: lam?.currency || "",
        },
    });

    const country = watch("country");
    const state = watch("state");
    const district = watch("district");
    const timezone = watch("timezone");
    const currency = watch("currency");

    // Transform data into SelectOption format
    const countryOptions: SelectOption[] = useMemo(() => {
        return (onboarding_fields_data?.address_details?.countries || []).map((c: any) => ({
            value: c.code,
            label: c.name,
            flag: c.flag,
        }));
    }, [onboarding_fields_data]);

    const stateOptions: SelectOption[] = useMemo(() => {
        return (onboarding_fields_data?.address_details?.states || []).map((s: any) => ({
            value: s.name,
            label: s.name,
        }));
    }, [onboarding_fields_data]);

    const districtOptions: SelectOption[] = useMemo(() => {
        return (onboarding_fields_data?.address_details?.districts || []).map((d: any) => ({
            value: d.name,
            label: d.name,
        }));
    }, [onboarding_fields_data]);

    const timezoneOptions: SelectOption[] = useMemo(() => {
        return (onboarding_fields_data?.meta_data?.timezones || []).map((tz: any) => ({
            value: tz.value,
            label: tz.label,
            description: tz.description,
            flag: tz.flag,
        }));
    }, [onboarding_fields_data]);

    const currencyOptions: SelectOption[] = useMemo(() => {
        return (onboarding_fields_data?.meta_data?.currencies || []).map((c: any) => ({
            value: c.value,
            label: c.label,
            symbol: c.symbol,
            flag: c.flag,
        }));
    }, [onboarding_fields_data]);

    const onSubmit = async (data: BusinessDetailsFormData) => {
        try {
            const response = await update_location_and_metadata(data);
            toast.success(
                response?.message || "Location and metadata updated successfully",
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
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b-2 border-red-500 pb-2 inline-block">
                        Address Details
                    </h3>

                    {/* Country & State - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomSelector
                            label="Country"
                            required
                            options={countryOptions}
                            value={country}
                            onChange={(value) => setValue("country", value)}
                            placeholder="Select country"
                            searchPlaceholder="Search countries..."
                            error={errors.country?.message}
                        />

                        <CustomSelector
                            label="State"
                            required
                            options={stateOptions}
                            value={state}
                            onChange={(value) => setValue("state", value)}
                            placeholder="Select state"
                            searchPlaceholder="Search states..."
                            error={errors.state?.message}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomSelector
                            label="District"
                            required
                            options={districtOptions}
                            value={district}
                            onChange={(value) => setValue("district", value)}
                            placeholder="Select district"
                            searchPlaceholder="Search districts..."
                            error={errors.district?.message}
                        />

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Municipality <span className="text-red-600">*</span>
                            </label>
                            <input
                                {...register("municipality")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-800 bg-white"
                                placeholder="Enter municipality"
                            />
                            {errors.municipality && (
                                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                    <span className="text-xs">⚠</span>{" "}
                                    {errors.municipality.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location <span className="text-red-600">*</span>
                            </label>
                            <input
                                {...register("location")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-800 bg-white"
                                placeholder="Street address or area"
                            />
                            {errors.location && (
                                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                    <span className="text-xs">⚠</span> {errors.location.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Landmark <span className="text-red-600">*</span>
                            </label>
                            <input
                                {...register("landmark")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-800 bg-white"
                                placeholder="Nearby landmark"
                            />
                            {errors.landmark && (
                                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                    <span className="text-xs">⚠</span> {errors.landmark.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metadata Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b-2 border-red-500 pb-2 inline-block">
                        Business Metadata
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomSelector
                            label="Timezone"
                            required
                            options={timezoneOptions}
                            value={timezone}
                            onChange={(value) => setValue("timezone", value)}
                            placeholder="Select timezone"
                            searchPlaceholder="Search timezones..."
                            error={errors.timezone?.message}
                        />

                        <CustomSelector
                            label="Currency"
                            required
                            options={currencyOptions}
                            value={currency}
                            onChange={(value) => setValue("currency", value)}
                            placeholder="Select currency"
                            searchPlaceholder="Search currencies..."
                            error={errors.currency?.message}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full py-5.5 rounded-sm bg-red-600 text-white hover:bg-red-700 transition-all font-semibold text-base shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            Saving...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <Save className="w-5 h-5" />
                            Save Location & Metadata
                        </span>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default LocationAndMetadata;
