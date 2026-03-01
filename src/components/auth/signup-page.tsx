"use client";

import { useSearchParams } from "next/navigation";
import SignupForm from "@/components/auth/signup-form";

export default function SignupPageClient() {
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get("redirect_uri");

  return (
    <main className="w-full min-h-screen">
      <SignupForm redirectUri={redirectUri} />
    </main>
  );
}
