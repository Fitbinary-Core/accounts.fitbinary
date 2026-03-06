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
import { useEffect, useMemo, useState } from "react";
import { IApplication } from "@/types/apps";
import { cn } from "@/lib/utils";
import BusinessDetails from "@/components/onboarding/BusinessDetails";
import LocationAndMetadata from "@/components/onboarding/LocationAndMetadata";
import BranchSetup from "@/components/onboarding/BranchSetup";
import Categories from "@/components/onboarding/Categories";
import PlansAndPricing from "@/components/onboarding/PlansAndPricing";
import { get_onboarding_data } from "@/services/onboarding/onboarding.service";
import { OnboardingDataRes } from "@/schemas/onboarding";

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

  const { data: onboardingData, isLoading: isLoadingOnboarding } =
    useQuery<OnboardingDataRes>({
      queryKey: ["onboarding-data", selectedApp?._id || ""],
      queryFn: () => get_onboarding_data(selectedApp?._id),
      enabled: !!selectedApp,
    });

  useEffect(() => {
    if (onboardingData?.active_step_path) {
      const stepMap: Record<string, CreateStep> = {
        business_details: CreateStep.BUSINESS_DETAILS,
        location_and_metadata: CreateStep.LOCATION_METADATA,
        branch_details: CreateStep.BRANCH_SETUP,
        categories_details: CreateStep.CATEGORIES,
        subscription_and_billing: CreateStep.PLANS,
      };

      const nextStep = stepMap[onboardingData.active_step_path];
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [onboardingData, selectedApp]);

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

  if (isLoadingApps || (selectedApp && isLoadingOnboarding)) {
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
      <div className="w-full mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

        <div className="w-full flex flex-col gap-6">
          {/* Progress Header */}
          <div className="bg-white border border-zinc-200 rounded-md p-4 shadow-sm">
            <nav className="relative flex flex-wrap lg:flex-nowrap items-center justify-between">
              {steps.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isPast =
                  steps.findIndex((s) => s.id === currentStep) > idx;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 flex-1 min-w-max",
                      idx !== steps.length - 1 &&
                        "after:content-[''] after:hidden lg:after:block after:h-px after:flex-1 after:bg-zinc-100 after:mx-4",
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-500",
                          isPast
                            ? "border-green-500 bg-green-50 text-green-600"
                            : isActive
                              ? "border-brand-red bg-brand-red text-white"
                              : "border-gray-200 bg-white text-gray-400",
                        )}
                      >
                        {isPast ? (
                          <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="hidden sm:block mt-2">
                        <span
                          className={cn(
                            "text-[10px] text-center font-bold uppercase tracking-widest block",
                            isActive ? "text-brand-red" : "text-gray-400",
                          )}
                        >
                          Step 0{idx + 1}
                        </span>
                        <p
                          className={cn(
                            "text-sm font-bold whitespace-nowrap",
                            isActive ? "text-gray-900" : "text-gray-500",
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <main className="w-full">
            <div className="bg-white border border-zinc-200 rounded-md shadow-sm min-h-125">
              {currentStep === CreateStep.APP_SELECTION && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {applications.map((app) => (
                      <button
                        key={app._id}
                        onClick={() => handleAppSelect(app)}
                        className="group relative bg-zinc-50 border border-zinc-100 rounded-xl p-6 text-left transition-all hover:bg-white hover:shadow-xl hover:cursor-pointer hover:border-brand-red/20 active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="size-14 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-110 transition-transform border border-zinc-100">
                            {app.icon ? (
                              <img
                                src="/Icon.png"
                                alt={app.name}
                                className="size-full object-cover"
                              />
                            ) : (
                              <LayoutGrid className="size-7 text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-zinc-900 group-hover:text-brand-red transition-colors text-lg">
                              {app.name}
                            </h3>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded-full">
                              {app.app_slug}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
                          {app.description ||
                            "Create organization for this application service."}
                        </p>
                        <div className="mt-4 flex items-center text-brand-red text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                          Get Started →
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === CreateStep.BUSINESS_DETAILS &&
                !!onboardingData && (
                  <BusinessDetails
                    business_details={onboardingData}
                    selectedApp={selectedApp}
                    onStepComplete={nextStep}
                  />
                )}

              {currentStep === CreateStep.LOCATION_METADATA &&
                !!onboardingData && (
                  <LocationAndMetadata
                    location_and_metadata={onboardingData}
                    onStepComplete={nextStep}
                  />
                )}

              {currentStep === CreateStep.BRANCH_SETUP && !!onboardingData && (
                <BranchSetup
                  branch_details={onboardingData.branch_details}
                  selectedApp={selectedApp}
                  onStepComplete={nextStep}
                />
              )}

              {currentStep === CreateStep.CATEGORIES && (
                <Categories onStepComplete={nextStep} />
              )}

              {currentStep === CreateStep.PLANS && (
                <PlansAndPricing
                  selectedApp={selectedApp}
                  onStepComplete={() => {
                    window.location.href = "/organization/list";
                  }}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
