"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

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
        ? `${redirectUrl}/${key}`
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
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-zinc-900 selection:text-white">
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

          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">
              Log in to your account
            </h1>
            <p className="text-zinc-500">
              Welcome back! Please enter your credentials to login.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                className="h-11 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-900"
                >
                  Password
                </label>
                <a
                  href="/forget-password"
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 pr-10 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                  {...register("password")}
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
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-11 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {isPending ? "Logging in..." : "Log in"}
              {!isPending && (
                <ArrowRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-zinc-900 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-zinc-950 relative overflow-hidden flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 bg-[#18181b] bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="size-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-white/5">
            <span className="text-zinc-900 font-bold text-3xl leading-none">
              F
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-[1.2] mb-4">
            Sign in to your {"Fitbinary Accounts"}
            <br />
          </h2>
        </div>
      </div>
    </div>
  );
}
