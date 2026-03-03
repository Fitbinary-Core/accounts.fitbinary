"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSessionStatus } from "@/services/plans/plans.service";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

import { CheckCircle, XCircle as ErrorIcon, Shield } from "lucide-react";

export default function CheckoutReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<
    "loading" | "complete" | "open" | "failed"
  >("loading");
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    const fetchStatus = async () => {
      try {
        const data = await getSessionStatus(sessionId);
        setStatus(data.status);
        setCustomerEmail(data.customerEmail);

        if (data.status === "complete") {
          toast.success("Payment successful!");
        }
      } catch (error) {
        console.error("Error fetching session status:", error);
        setStatus("failed");
        toast.error("Failed to verify payment status.");
      }
    };

    fetchStatus();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="size-10 animate-spin text-zinc-900 mb-4" />
        <h1 className="text-lg font-semibold text-zinc-900">
          Verifying payment...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="max-w-md w-full bg-white border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center bg-white border-b border-gray-100">
          {status === "complete" ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="size-12 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold text-zinc-900 mb-2">
                Order Completed
              </h1>
              <p className="text-zinc-500 text-sm">
                Thank you for your purchase. Your subscription has been
                activated.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ErrorIcon className="size-12 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-zinc-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-zinc-500 text-sm">
                We couldn't process your payment. Please try again or contact
                support.
              </p>
            </div>
          )}
        </div>

        <div className="p-8 bg-white space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Email</span>
              <span className="text-zinc-900 font-semibold truncate ml-4">
                {customerEmail || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
              <span className="text-zinc-500 font-medium">Reference ID</span>
              <span className="text-zinc-900 font-mono text-xs">
                {sessionId?.slice(0, 16)}...
              </span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {status === "complete" ? (
              <Button
                className="w-full h-11 cursor-pointer bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors font-medium"
                onClick={() => router.push("/")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                className="w-full h-11 cursor-pointer bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors font-medium"
                onClick={() => router.push("/organization/create")}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
          <Shield className="size-3.5 text-zinc-400" />
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
            Secure Payment Verification
          </span>
        </div>
      </Card>
    </div>
  );
}
