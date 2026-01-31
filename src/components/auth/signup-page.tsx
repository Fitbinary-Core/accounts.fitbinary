"use client";

import { useSearchParams } from "next/navigation";
import SignupForm from "@/components/auth/signup-form";

export default function SignupPageClient() {
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get("redirect_uri");

  return <SignupForm redirectUri={redirectUri} />;
}
