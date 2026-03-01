import type { Metadata } from "next";
import { Suspense } from "react";
import SignupPageClient from "@/components/auth/signup-page";
import Loading from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join Fitbinary and get access to our centralized management panel for all your applications.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupPageClient />
    </Suspense>
  );
}
