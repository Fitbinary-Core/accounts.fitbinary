"use client";

import { getSubscriptionList } from "@/services/plans/plans.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import SkipConfirmationDialog from "./SkipConfirmationDialog";
import {
  SubscriptionPlan,
  ProfileResponse,
  PlansResponse,
} from "@/services/auth/types/auth.types";
import FreeTrailDialog from "./FreeTrailDialog";
import toast from "react-hot-toast";
import { createCheckoutSession } from "@/services/plans/plans.service";
import { startFreeTrial } from "@/services/onboarding/onboarding.service";
import { getUserProfile } from "@/services/auth/auth.service";
import { loadStripe } from "@stripe/stripe-js";

// Shared Pricing Components
import {
  StepIndicator,
  CheckoutStep,
} from "@/components/common/pricing/StepIndicator";
import { PlansSection } from "@/components/common/pricing/PlansSection";
import { OrderSummary } from "@/components/common/pricing/OrderSummary";
import { PaymentSection } from "@/components/common/pricing/PaymentSection";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

type BillingCycle = "MONTHLY" | "YEARLY";
const YEARLY_DISCOUNT = 0.2;

import { IApplication } from "@/types/apps";

interface PlansAndPricingProps {
  selectedApp?: IApplication | null;
  onStepComplete?: () => void;
}

const PlansAndPricing = ({
  selectedApp,
  onStepComplete,
}: PlansAndPricingProps) => {
  const queryClient = useQueryClient();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [activeStep, setActiveStep] = useState<CheckoutStep>("PLANS");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [provider, setProvider] = useState<"STRIPE" | "ESEWA">("STRIPE");

  const { data, isLoading } = useQuery<PlansResponse>({
    queryKey: ["all-plans", selectedApp?._id],
    queryFn: () => getSubscriptionList(selectedApp?._id),
  });

  const { data: profileRes, isLoading: isProfileLoading } =
    useQuery<ProfileResponse>({
      queryKey: ["profile-data"],
      queryFn: getUserProfile,
    });

  const [showSkipDialog, setShowSkipDialog] = useState<boolean>(false);
  const [showFreeTrialDialog, setShowFreeTrialDialog] =
    useState<boolean>(false);

  const isYearly = billingCycle === "YEARLY";

  const pricingDetails = useMemo(() => {
    if (!selectedPlan) return null;
    const monthlyPrice = selectedPlan.price;
    const displayedPrice = isYearly
      ? +(monthlyPrice * (1 - YEARLY_DISCOUNT)).toFixed(2)
      : monthlyPrice;
    const totalAmount = isYearly ? displayedPrice * 12 : displayedPrice;
    const savings = isYearly
      ? Math.round(monthlyPrice * 12 - displayedPrice * 12)
      : 0;

    return { displayedPrice, totalAmount, savings };
  }, [selectedPlan, isYearly]);

  const fetchCheckoutData = async () => {
    if (!selectedPlan) {
      toast.error("Plan not selected. Please select a plan to continue.");
      return null;
    }

    try {
      const response = await createCheckoutSession({
        planId: selectedPlan._id,
        provider: provider,
        appId: selectedApp?._id,
      });

      return response;
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate checkout");
      return null;
    }
  };

  const handleBackToPlans = () => {
    setActiveStep("PLANS");
  };

  const handleBackToSummary = () => {
    setActiveStep("SUMMARY");
  };

  const handleConfirmOrder = () => {
    setActiveStep("PAYMENT");
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    const isFreeTrial =
      plan.price === 0 ||
      plan.name.toLowerCase() === "free trail" ||
      plan.name.toLowerCase() === "free trial";

    if (isFreeTrial) {
      setShowFreeTrialDialog(true);
    } else {
      setActiveStep("SUMMARY");
    }
  };

  const handleSkipConfirm = () => {
    setShowSkipDialog(false);
  };

  const handleConfirmFreeTrial = async () => {
    try {
      const response = await startFreeTrial(
        selectedPlan?._id,
        selectedApp?._id,
      );
      if (response.message) {
        toast.success(response.message);
      } else {
        toast.success("Free trial started successfully!");
      }

      await queryClient.invalidateQueries({ queryKey: ["onboarding-data"] });
      setShowFreeTrialDialog(false);
      if (onStepComplete) {
        onStepComplete();
      }
    } catch (error: any) {
      toast.error(
        error.message || "Failed to start free trial. Please try again.",
      );
    }
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-125">
        <Loader2 className="animate-spin h-10 w-10 text-red-600" />
      </div>
    );
  }

  const plans = (data as any)?.plans || [];

  return (
    <div className="w-full mx-auto p-4 space-y-8">
      <StepIndicator activeStep={activeStep} />

      {activeStep === "PLANS" && (
        <>
          <PlansSection
            subscriptions={plans}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            onSelectPlan={handleSelectPlan}
          />
        </>
      )}

      {activeStep === "SUMMARY" && selectedPlan && pricingDetails && (
        <OrderSummary
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          pricingDetails={pricingDetails}
          onBack={handleBackToPlans}
          onConfirm={handleConfirmOrder}
        />
      )}

      {activeStep === "PAYMENT" && selectedPlan && pricingDetails && (
        <PaymentSection
          stripePromise={stripePromise}
          fetchCheckoutData={fetchCheckoutData}
          onBack={handleBackToSummary}
          provider={provider}
          setProvider={setProvider}
        />
      )}

      <SkipConfirmationDialog
        isOpen={showSkipDialog}
        onClose={() => setShowSkipDialog(false)}
        onConfirm={handleSkipConfirm}
      />

      <FreeTrailDialog
        isOpen={showFreeTrialDialog}
        onClose={() => setShowFreeTrialDialog(false)}
        onConfirm={handleConfirmFreeTrial}
      />
    </div>
  );
};

export default PlansAndPricing;
