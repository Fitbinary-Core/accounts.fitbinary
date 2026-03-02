"use client";

import { Check } from "lucide-react";

export type CheckoutStep = "PLANS" | "SUMMARY" | "PAYMENT";

interface StepIndicatorProps {
    activeStep: CheckoutStep;
}

const steps: { id: CheckoutStep; label: string }[] = [
    { id: "PLANS", label: "Select Plan" },
    { id: "SUMMARY", label: "Order Summary" },
    { id: "PAYMENT", label: "Payment" },
];

export const StepIndicator = ({ activeStep }: StepIndicatorProps) => {
    const activeIndex = steps.findIndex((step) => step.id === activeStep);

    return (
        <div className="flex items-center justify-center mb-8 gap-0 w-full max-w-3xl mx-auto">
            {steps.map((item, index) => (
                <div
                    key={item.id}
                    className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
                >
                    <div className="flex flex-col items-center top-3 relative z-10 bg-gray-50/30 md:px-4">
                        <div
                            className={`w-10 h-10 flex items-center justify-center font-semibold text-sm rounded-md border-2 transition-all ${activeStep === item.id
                                    ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20"
                                    : index < activeIndex
                                        ? "bg-red-600 text-white border-red-600"
                                        : "bg-white text-gray-400 border-gray-200"
                                }`}
                        >
                            {index < activeIndex ? <Check className="w-5 h-5" /> : index + 1}
                        </div>
                        <span
                            className={`text-xs font-semibold uppercase tracking-wider mt-3 ${activeStep === item.id ? "text-gray-900" : "text-gray-400"
                                }`}
                        >
                            {item.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`flex-1 h-0.5 -ml-8 -mr-8 border-t-2 border-dashed ${index < activeIndex ? "border-red-600" : "border-gray-200"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
