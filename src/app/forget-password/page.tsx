import type { Metadata } from "next";
import ForgetPasswordForm from "@/components/auth/forget-password-form";

export const metadata: Metadata = {
    title: "Reset Your Password - Fitbinary",
    description: "Forgot your Fitbinary password? Enter your email to receive a secure reset link and regain access to your account.",
};

const ForgetPasswordPage = () => {
    return (
        <div className="min-h-screen w-full">
            <ForgetPasswordForm />
        </div>
    )
}

export default ForgetPasswordPage;
