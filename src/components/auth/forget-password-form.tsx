"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import {
  sendForgetPasswordPin,
  verifyForgetPasswordPin,
  resetPassword,
} from "@/services/auth/auth.service";

export default function ForgetPasswordForm() {
  const router = useRouter();

  // Step 1: Email
  const [email, setEmail] = useState("");
  // Step 2: OTP
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  // Step 3: New Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // View state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Timer logic for Step 2
  useEffect(() => {
    if (step !== 2 || timer <= 0) {
      if (timer <= 0) setIsResendDisabled(false);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const sendPinMutation = useMutation({
    mutationFn: sendForgetPasswordPin,
    onSuccess: (response: any) => {
      toast.success(response.message || "Verification code sent to your email");
      setTimer(60);
      setIsResendDisabled(true);
      setStep(2);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send verification email");
    },
  });

  const verifyPinMutation = useMutation({
    mutationFn: async () => verifyForgetPasswordPin(email, otp),
    onSuccess: () => {
      toast.success("OTP verified successfully");
      setStep(3);
    },
    onError: (error: any) => {
      toast.error(error.message || "Invalid OTP");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async () =>
      resetPassword({ email, otp, newPassword: password }),
    onSuccess: (response: any) => {
      toast.success(response.message || "Password reset successfully");
      router.push("/signin");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reset password");
    },
  });

  const handleSendPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    sendPinMutation.mutate(email);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    verifyPinMutation.mutate();
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    resetPasswordMutation.mutate();
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-zinc-900 selection:text-white">
      {/* Left Panel - Auth Form */}
      <div className="w-full md:w-[50%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 border-r border-zinc-100">
        <div className="w-full max-w-100 mx-auto">
          <Link href="/" className="inline-flex items-center gap-3 mb-16">
            <div className="size-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">
                F
              </span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-zinc-900">
              Fitbinary
            </span>
          </Link>

          {step === 1 && (
            <>
              <div className="mb-10">
                <Link
                  href="/signin"
                  className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="mr-2 size-4" /> Back to log in
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">
                  Forgot password?
                </h1>
                <p className="text-zinc-500">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleSendPin} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sendPinMutation.isPending}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-11 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {sendPinMutation.isPending ? "Sending..." : "Reset password"}
                  {!sendPinMutation.isPending && (
                    <ArrowRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-10">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="mr-2 size-4" /> Back to email
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">
                  Check your email
                </h1>
                <p className="text-zinc-500">
                  We sent a secure 6-digit pin to <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-11 bg-white tracking-[0.5em] text-center border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm text-lg font-bold"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={verifyPinMutation.isPending || otp.length !== 6}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-11 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {verifyPinMutation.isPending ? "Verifying..." : "Verify code"}
                  {!verifyPinMutation.isPending && (
                    <ArrowRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>

                <div className="mt-8 text-center text-sm text-zinc-500">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    disabled={isResendDisabled || sendPinMutation.isPending}
                    onClick={() => sendPinMutation.mutate(email)}
                    className="font-semibold text-zinc-900 hover:underline disabled:opacity-50 disabled:hover:no-underline"
                  >
                    Click to resend {timer > 0 && `(${timer}s)`}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">
                  Set new password
                </h1>
                <p className="text-zinc-500">
                  Your new password must be different to previously used
                  passwords.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4.5" />
                      ) : (
                        <Eye className="size-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 pr-10 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Must be at least 8 characters.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-11 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {resetPasswordMutation.isPending
                    ? "Resetting..."
                    : "Reset password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-zinc-950 relative overflow-hidden flex-col justify-between p-6 md:p-12">
        <div className="absolute inset-0 bg-[#18181b] bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 text-zinc-400 font-medium tracking-wide text-sm uppercase">
          Fitbinary Enterprise
        </div>

        <div className="relative z-10">
          {step === 1 && (
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-8">
              Forgot password?
              <br />
              Don't worry.
              <br />
              We've got you.
            </h2>
          )}
          {step === 2 && (
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-8">
              Verify identity.
              <br />
              Secure access.
              <br />
              Stay protected.
            </h2>
          )}
          {step === 3 && (
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-8">
              Set new password.
              <br />
              Regain control.
              <br />
              Resume workflow.
            </h2>
          )}

          <div className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            System Secured
          </div>
        </div>

        <div className="relative z-10 border-t border-zinc-800 pt-8 mt-16 max-w-lg">
          <p className="text-lg text-zinc-400 leading-relaxed">
            "Fitbinary's secure access protocols keep our enterprise data safe
            while ensuring our team never loses a moment of productivity."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="size-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold">
              SB
            </div>
            <div>
              <div className="text-white font-medium">Sarah Blake</div>
              <div className="text-zinc-500 text-sm">
                Security Head, Fortis Inc.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
