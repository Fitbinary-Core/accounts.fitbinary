import { Suspense } from "react";
import SignupPageClient from "@/components/auth/signup-page";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageClient />
    </Suspense>
  );
}
