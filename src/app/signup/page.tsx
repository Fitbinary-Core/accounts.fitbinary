"use client";

import SignupForm from "@/components/auth/signup-form";
import { useSearchParams } from "next/navigation";

const SignUpPage = () => {
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get("redirect_uri");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 md:p-6 lg:p-8">
      <SignupForm redirectUri={redirectUri} />
    </div>
  );
};

export default SignUpPage;
