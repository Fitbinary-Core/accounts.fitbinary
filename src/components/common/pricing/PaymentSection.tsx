"use client";

import { ArrowLeft, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

interface PaymentSectionProps {
    stripePromise: Promise<Stripe | null>;
    fetchCheckoutData: () => Promise<any>;
    onBack: () => void;
    onCancel?: () => void;
    provider: "STRIPE" | "ESEWA";
    setProvider: (provider: "STRIPE" | "ESEWA") => void;
}

export const PaymentSection = ({
    stripePromise,
    fetchCheckoutData,
    onBack,
    onCancel,
    provider,
    setProvider,
}: PaymentSectionProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleEsewaPayment = async () => {
        setIsProcessing(true);
        try {
            const data = await fetchCheckoutData();
            if (data && data.provider === "ESEWA" && data.payment_data) {
                const form = document.createElement("form");
                form.method = "POST";
                form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

                Object.entries(data.payment_data).forEach(([key, value]) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = value as string;
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            } else {
                toast.error("Failed to initiate eSewa payment");
            }
        } catch (error) {
            console.error("eSewa payment error:", error);
            toast.error("An error occurred during eSewa payment initiation");
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchClientSecretForStripe = async () => {
        const data = await fetchCheckoutData();
        return data?.clientSecret || "";
    };

    return (
        <div className="w-full mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md min-h-150 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-red-600 rounded-xl text-white shadow-md shadow-red-600/20">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Payment Center
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Choose your preferred payment method
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                        <Button
                            onClick={onBack}
                            className="rounded-sm font-semibold text-sm border-2 border-gray-200 hover:bg-gray-50 transition-all w-full md:w-auto py-5"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                        {onCancel && (
                            <Button
                                onClick={onCancel}
                                className="rounded-sm font-semibold text-sm border-2 border-gray-200 hover:bg-gray-50 transition-all w-full md:w-auto py-5"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>

                <div className="p-2 md:p-6 flex flex-col md:flex-row gap-8">
                    {/* Method Selector */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Select Method
                        </h3>

                        <button
                            onClick={() => setProvider("STRIPE")}
                            className={`w-full p-4 rounded-md cursor-pointer border-2 transition-all flex items-center justify-between group ${provider === "STRIPE"
                                ? "border-red-600 bg-red-50/30"
                                : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2 rounded-sm ${provider === "STRIPE" ? "bg-transparent text-white" : "bg-gray-100 text-gray-400"}`}
                                >
                                    <Image
                                        src={"/stripe_logo.png"}
                                        width={40}
                                        height={40}
                                        alt="Pay with stripe"
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">Pay via stripe</p>
                                </div>
                            </div>
                            <ChevronRight
                                className={`w-5 h-5 transition-transform ${provider === "STRIPE" ? "text-red-600 translate-x-1" : "text-gray-300"}`}
                            />
                        </button>

                        <button
                            onClick={() => setProvider("ESEWA")}
                            className={`w-full p-4 rounded-md border-2 cursor-pointer transition-all flex items-center justify-between group ${provider === "ESEWA"
                                ? "border-green-600 bg-green-50/30"
                                : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2 rounded-sm ${provider === "ESEWA" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}
                                >
                                    <Image
                                        src={"/Esewa_logo.png"}
                                        width={40}
                                        height={40}
                                        alt="Pay with esewa"
                                    />{" "}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">Pay via eSewa</p>
                                </div>
                            </div>
                            <ChevronRight
                                className={`w-5 h-5 transition-transform ${provider === "ESEWA" ? "text-green-600 translate-x-1" : "text-gray-300"}`}
                            />
                        </button>
                    </div>

                    {/* Payment Area */}
                    <div className="w-full md:w-2/3 min-h-100 border-l border-gray-100 pl-0 md:pl-8">
                        {provider === "STRIPE" ? (
                            <div
                                id="checkout"
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                            >
                                <EmbeddedCheckoutProvider
                                    stripe={stripePromise}
                                    options={{ fetchClientSecret: fetchClientSecretForStripe }}
                                >
                                    <EmbeddedCheckout />
                                </EmbeddedCheckoutProvider>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center space-y-4">
                                    <div className="w-24 h-24 bg-green-55 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-green-600 text-xl font-black">
                                            eSewa
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Pay via eSewa
                                    </h3>
                                    <p className="text-gray-500 max-w-sm">
                                        You'll be redirected to eSewa's secure payment gateway to
                                        finish your transaction.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleEsewaPayment}
                                    disabled={isProcessing}
                                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full text-lg font-bold shadow-sm shadow-green-600/20 w-full max-w-xs"
                                >
                                    {isProcessing ? "Redirecting..." : "Pay with eSewa"}
                                </Button>
                                <p className="text-xs text-gray-500">
                                    Trusted by millions of users across Nepal
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
