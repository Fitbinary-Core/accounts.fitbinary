"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { get_all_apps } from "@/services/apps/apps.service";
import { useQuery } from "@tanstack/react-query";
import {
  MoveLeft,
  LayoutGrid,
  Building2,
  MapPin,
  Tag,
  CreditCard,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IApplication } from "@/types/apps";
import { cn } from "@/lib/utils";
import BusinessDetails from "@/components/onboarding/BusinessDetails";
import LocationAndMetadata from "@/components/onboarding/LocationAndMetadata";
import BranchSetup from "@/components/onboarding/BranchSetup";
import Categories from "@/components/onboarding/Categories";
import PlansAndPricing from "@/components/onboarding/PlansAndPricing";
import { get_onboarding_data } from "@/services/onboarding/onboarding.service";

enum CreateStep {
  APP_SELECTION = "APP_SELECTION",
  BUSINESS_DETAILS = "BUSINESS_DETAILS",
  LOCATION_METADATA = "LOCATION_METADATA",
  BRANCH_SETUP = "BRANCH_SETUP",
  CATEGORIES = "CATEGORIES",
  PLANS = "PLANS",
}

export default function OrganizationCreatePage() {
  const [currentStep, setCurrentStep] = useState<CreateStep>(
    CreateStep.APP_SELECTION,
  );
  const [selectedApp, setSelectedApp] = useState<IApplication | null>(null);

  const { data: appsData, isLoading: isLoadingApps } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
  });

  const { data: onboardingData, isLoading: isLoadingOnboarding } = useQuery({
    queryKey: ["onboarding-data"],
    queryFn: get_onboarding_data,
  });

  const steps = useMemo(() => {
    return [
      {
        id: CreateStep.APP_SELECTION,
        label: "Select Application",
        icon: LayoutGrid,
      },
      {
        id: CreateStep.BUSINESS_DETAILS,
        label: "Business Profile",
        icon: Building2,
      },
      {
        id: CreateStep.LOCATION_METADATA,
        label: "Localization",
        icon: MapPin,
      },
      {
        id: CreateStep.BRANCH_SETUP,
        label: "Initial Branch",
        icon: Rocket,
      },
      {
        id: CreateStep.CATEGORIES,
        label: "Industry Focus",
        icon: Tag,
      },
      {
        id: CreateStep.PLANS,
        label: "Select Plan",
        icon: CreditCard,
      },
    ];
  }, []);

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  const handleAppSelect = (app: IApplication) => {
    setSelectedApp(app);
    setCurrentStep(CreateStep.BUSINESS_DETAILS);
  };

  const nextStep = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < steps.length) {
      setCurrentStep(steps[nextIdx].id);
    }
  };

  if (isLoadingApps || isLoadingOnboarding) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="size-12 border-4 border-zinc-100 border-t-brand-red rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
            Syncing Environment...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const applications = appsData?.applications || [];

  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <Link
            href="/organization/list"
            className="size-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-all"
          >
            <MoveLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              Create Organization
            </h1>
            <p className="text-zinc-500">
              {currentStep === CreateStep.APP_SELECTION
                ? "First, select an application to get started."
                : `Setting up organization for ${selectedApp?.name}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Progress Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <nav className="relative space-y-2">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200/60" />
              {steps.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isPast =
                  steps.findIndex((s) => s.id === currentStep) > idx;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "group relative flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-300",
                      isActive
                        ? "bg-white shadow-xl shadow-gray-200/50 border border-gray-100 ring-1 ring-black/5"
                        : "",
                    )}
                  >
                    <div
                      className={cn(
                        "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-500",
                        isPast
                          ? "border-green-500 bg-green-50 text-green-600"
                          : isActive
                            ? "border-brand-red bg-brand-red text-white shadow-lg shadow-red-200"
                            : "border-gray-200 bg-white text-gray-400",
                      )}
                    >
                      {isPast ? (
                        <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-widest",
                          isActive ? "text-brand-red" : "text-gray-400",
                        )}
                      >
                        Step 0{idx + 1}
                      </span>
                      <p
                        className={cn(
                          "truncate text-lg font-bold",
                          isActive ? "text-gray-900" : "text-gray-500",
                        )}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <main className="lg:col-span-8">
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              {currentStep === CreateStep.APP_SELECTION && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.map((app) => (
                      <button
                        key={app._id}
                        onClick={() => handleAppSelect(app)}
                        className="group relative bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-left transition-all hover:bg-white hover:shadow-xl hover:border-zinc-200"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="size-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                            {app.icon ? (
                              <img
                                src="/Icon.png"
                                alt={app.name}
                                className="size-full object-cover"
                              />
                            ) : (
                              <LayoutGrid className="size-6 text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-zinc-900 group-hover:text-brand-red transition-colors">
                              {app.name}
                            </h3>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                              {app.app_slug}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                          {app.description ||
                            "Create organization for this application service."}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === CreateStep.BUSINESS_DETAILS &&
                onboardingData && (
                  <BusinessDetails
                    business_details={onboardingData}
                    onStepComplete={nextStep}
                  />
                )}

              {currentStep === CreateStep.LOCATION_METADATA &&
                onboardingData && (
                  <LocationAndMetadata
                    location_and_metadata={onboardingData}
                    onStepComplete={nextStep}
                  />
                )}

              {currentStep === CreateStep.BRANCH_SETUP && onboardingData && (
                <BranchSetup
                  branch_details={onboardingData.branch_details}
                  onStepComplete={nextStep}
                />
              )}

              {currentStep === CreateStep.CATEGORIES && (
                <Categories onStepComplete={nextStep} />
              )}

              {currentStep === CreateStep.PLANS && (
                <PlansAndPricing
                  onStepComplete={() =>
                    (window.location.href = "/organization/list")
                  }
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
