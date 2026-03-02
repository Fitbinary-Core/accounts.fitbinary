"use client";

import { Check, Shield, Star, Zap, Info } from "lucide-react";
import { SubscriptionPlan } from "@/services/auth/types/auth.types";
import { Button } from "@/components/ui/button";

interface PlanCardProps {
    plan: SubscriptionPlan;
    billingCycle: "MONTHLY" | "YEARLY";
    onSelect: (plan: SubscriptionPlan) => void;
}

const YEARLY_DISCOUNT = 0.2;

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

export const PlanCard = ({ plan, billingCycle, onSelect }: PlanCardProps) => {
    const isYearly = billingCycle === "YEARLY";

    const getPlanIcon = (name: string) => {
        if (name.toLowerCase().includes("premium"))
            return <Star className="w-5 h-5 text-red-600" />;
        if (name.toLowerCase().includes("growth"))
            return <Zap className="w-5 h-5 text-red-600" />;
        return <Shield className="w-5 h-5 text-gray-700" />;
    };

    const getDisplayedPrice = (price: number) => {
        if (billingCycle === "MONTHLY") return price;
        return +(price * (1 - YEARLY_DISCOUNT)).toFixed(2);
    };

    const price = getDisplayedPrice(plan.price);
    const isGrowth = plan.name.toLowerCase().includes("growth");

    return (
        <div
            className={`flex flex-col bg-white border-2 rounded-2xl transition-all duration-300 relative group min-h-full ${isGrowth
                    ? "border-red-600 shadow-xl shadow-red-600/10 scale-105 z-10"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                }`}
        >
            {isGrowth && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-red-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                        Most Popular
                    </div>
                </div>
            )}

            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 shadow-sm">
                        {getPlanIcon(plan.name)}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 h-10 border-b border-gray-100 pb-4">
                    {plan.description}
                </p>
            </div>

            <div className="p-8">
                <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-gray-900 tracking-tight" >
                        ${price}
                    </span>
                    <span className="text-gray-500 font-medium text-sm">
                        / {isYearly ? "yr" : "mo"}
                    </span>
                </div>
                {isYearly && (
                    <p className="text-green-600 text-xs font-semibold mb-2">
                        Save ${(plan.price * 12 * YEARLY_DISCOUNT).toFixed(2)} a year
                    </p>
                )}

                <Button
                    onClick={() => onSelect(plan)}
                    className={`w-full py-6 rounded-xl font-semibold text-sm transition-all border-2 ${isGrowth
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-md shadow-red-600/20"
                            : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300"
                        }`}
                >
                    Get Started
                </Button>
            </div>

            <div className="flex-1 p-4 pt-0 bg-gray-50/30 rounded-b-2xl border-t border-gray-100">
                <div className="flex items-center gap-2 mb-4 pt-6">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Features Included
                    </span>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <ul className="space-y-4">
                    {plan.features
                        .filter((f) => f.type === "NUMBER" || Boolean(f.value))
                        .map((feature, idx) => (
                            <li key={feature._id || idx} className="flex items-start gap-3">
                                <div className="shrink-0 rounded-full bg-red-50 p-1 border border-red-100 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-red-600 stroke-3" />
                                </div>
                                <span className="text-sm text-gray-700 font-medium leading-relaxed">
                                    {formatFeatureName(feature)}
                                </span>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};
