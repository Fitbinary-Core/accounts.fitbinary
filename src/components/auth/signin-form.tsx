"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SigninValues = z.infer<typeof signinSchema>;

export default function SigninForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
      toast.success(response.message);
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to sign in");
    },
  });

  const onSubmit = (data: SigninValues) => {
    login(data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-100">
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm">
          <div className="p-8">
            {/* Logo & Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="size-10 bg-zinc-950 rounded-md flex items-center justify-center mb-6">
                {/* <img
                  src="/Icon.png"
                  alt="Fitbinary"
                  className="size-6 object-contain grayscale invert"
                /> */}
                F
              </div>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight mb-1">
                Sign in to Fitbinary
              </h1>
              <p className="text-zinc-500 text-sm">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="h-10 pl-9 bg-white border-zinc-200 rounded-md text-gray-900 focus:ring-0 focus:border-zinc-900 transition-all text-sm"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[11px] font-bold text-zinc-400 hover:text-zinc-900"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-10 pl-9 pr-9 bg-white border-zinc-200 text-gray-900 rounded-md focus:ring-0 focus:border-zinc-900 transition-all text-sm"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-10 rounded-md transition-all mt-2 disabled:opacity-70"
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
              <p className="text-sm text-zinc-500">
                New to Fitbinary?{" "}
                <a
                  href="/signup"
                  className="font-bold text-zinc-900 hover:underline"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-zinc-50 border-t rounded-b-xl border-zinc-100 flex items-center justify-center gap-4">
            <a
              href="#"
              className="text-[10px] font-bold text-zinc-600 hover:text-zinc-600 uppercase tracking-widest"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[10px] font-bold text-zinc-600 hover:text-zinc-600 uppercase tracking-widest"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-[10px] font-bold text-zinc-600 hover:text-zinc-600 uppercase tracking-widest"
            >
              Help
            </a>
          </div>
        </div>

        <p className="text-center text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-8">
          © {new Date().getFullYear()} Fitbinary Inc.
        </p>
      </div>
    </div>
  );
}
