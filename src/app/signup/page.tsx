import { Suspense } from "react";
import SignupPageClient from "@/components/auth/signup-page";
import Loading from "@/components/common/Loading";

export default function SignUpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupPageClient />
    </Suspense>
  );
}
