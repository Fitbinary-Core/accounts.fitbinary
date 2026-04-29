"use client";

import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginUser } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Loader2, Shield } from "lucide-react";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SigninValues = z.infer<typeof signinSchema>;

export default function SigninForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const slug = searchParams.get("slug") || "accounts";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      const key = response.data.key;
      const redirect_back_url = key
        ? `${redirectUrl}/${key}?key=${key}`
        : `${redirectUrl}`;

      if (redirectUrl) {
        window.location.href = redirect_back_url;
      } else {
        router.push("/");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to sign in");
    },
  });

  const onSubmit = (data: SigninValues) => {
    login({ ...data, ...(slug && { slug }) });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans selection:bg-red-100">
      <div className="hidden lg:flex lg:w-[40%] bg-gray-900 items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        <div className="relative z-10 w-full max-sm">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Fitbinary Identity</span>
          </div>

          <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
            Unified Access <br />
            <span className="text-gray-400">across all platforms.</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-70">
            Your Fitbinary account grants you access to Admin, Cloud, Stock, and more.
          </p>

          <div className="mt-16 text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
            Centralized Authentication
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-24 bg-white">
        <div className="w-full max-w-95">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <Shield className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-gray-900">Fitbinary Accounts</span>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign In</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-0.5">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="admin@fitbinary.com"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-gray-400`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-bold mt-1 ml-0.5">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-0.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <Link href="/forget-password" title="Forgot password?" className="text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors">
                  FORGOT?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-2.5 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-gray-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-bold mt-1 ml-0.5">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign in to Account
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-red-600 hover:text-red-700 hover:underline"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              &copy; {new Date().getFullYear()} Fitbinary. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
