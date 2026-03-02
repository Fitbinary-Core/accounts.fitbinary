"use client";

import { ArrowLeft, ArrowRight, Check, ShoppingCart } from "lucide-react";
import { SubscriptionPlan } from "@/services/auth/types/auth.types";
import { Button } from "@/components/ui/button";

interface PricingDetails {
    displayedPrice: number;
    totalAmount: number;
    savings: number;
}

interface OrderSummaryProps {
    selectedPlan: SubscriptionPlan;
    billingCycle: "MONTHLY" | "YEARLY";
    pricingDetails: PricingDetails;
    onBack: () => void;
    onConfirm: () => void;
}

const formatFeatureName = (feature: {
    code: string;
    type: "BOOLEAN" | "NUMBER";
    value: any;
}) => {
    const name = feature.code
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    if (feature.type === "NUMBER") {
        return `${name}: ${feature.value}`;
    }
    return name;
};

export const OrderSummary = ({
    selectedPlan,
    billingCycle,
    pricingDetails,
    onBack,
    onConfirm,
}: OrderSummaryProps) => {
    const isYearly = billingCycle === "YEARLY";

    return (
        <div className="w-full mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="p-4 bg-red-600 rounded-xl text-white shadow-md shadow-red-600/20">
                            <ShoppingCart className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Review Order</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Please confirm your subscription parameters
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full z-0 opacity-50" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                                            Selected Tier
                                        </span>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                            {selectedPlan.name}
                                        </h3>
                                    </div>
                                    <div className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold uppercase rounded-md border border-red-100">
                                        {billingCycle}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-6 font-medium">
                                    {selectedPlan.description}
                                </p>
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    {selectedPlan.features
                                        .filter((f) => f.type === "NUMBER" || Boolean(f.value))
                                        .slice(0, 6)
                                        .map((f, idx) => (
                                            <div
                                                key={f._id || idx}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="shrink-0 rounded-full bg-red-50 p-1 mt-0.5">
                                                    <Check className="w-3.5 h-3.5 text-red-600 stroke-3" />
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {formatFeatureName(f)}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-gray-900">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Billing Metrics
                            </span>
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200/60">
                                    <span className="text-sm font-medium text-gray-600">
                                        Base Rate
                                    </span>
                                    <span className="font-semibold text-lg">
                                        ${selectedPlan.price}/mo
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200/60">
                                    <span className="text-sm font-medium text-gray-600">
                                        Cycle Strategy
                                    </span>
                                    <span className="font-medium">
                                        {isYearly ? "Annual Prepay" : "Monthly-As-You-Go"}
                                    </span>
                                </div>
                                {isYearly && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200/60 text-green-600">
                                        <span className="text-sm font-semibold">
                                            Incentive Applied
                                        </span>
                                        <span className="font-bold">
                                            -${pricingDetails.savings} Saved
                                        </span>
                                    </div>
                                )}
                                <div className="pt-6">
                                    <span className="text-sm font-semibold text-gray-500 block mb-2 uppercase tracking-wide">
                                        Total Due Today
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                                            ${pricingDetails.totalAmount.toFixed(2)}
                                        </span>
                                        <span className="text-gray-500 font-medium text-sm">
                                            / {isYearly ? "Year" : "Month"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 bg-white flex flex-col md:flex-row gap-6">
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="flex-1 py-5 rounded-md text-gray-800 hover:text-gray-900 font-semibold text-sm border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Modify Selection
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 py-5 rounded-md font-semibold text-sm bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all"
                    >
                        Confirm & Secure Checkout
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
