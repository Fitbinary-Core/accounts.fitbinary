import type { Metadata } from "next";
import SigninForm from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Fitbinary account to manage your applications, subscriptions, and organizations.",
};

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full">
      <SigninForm />
    </div>
  );
};

export default SignInPage;
