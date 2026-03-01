"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Lock,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth/auth.service";
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

  const onSubmit = async (data: SigninValues) => {
    try {
      const response = await loginUser(data);
      toast.success(response.message);
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Panel: Branding & Value Proposition (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Abstract Background Accent */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-red blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-red blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="size-12 bg-brand-red rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-12 shadow-lg shadow-brand-red/20">
            F
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
            The control plane for your digital ecosystem.
          </h1>
          <p className="text-lg text-zinc-400 max-w-lg">
            Sign in to your Fitbinary account to access your personalized workspace, manage organization settings, and monitor your infrastructure.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="size-6 text-brand-red shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-200">Secure Access</h3>
              <p className="text-sm text-zinc-500">Industry-standard encryption and multi-factor authentication.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle2 className="size-6 text-brand-red shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-200">Role-Based Controls</h3>
              <p className="text-sm text-zinc-500">Access exactly what you need based on your organizational role.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle2 className="size-6 text-brand-red shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-200">Real-time Insights</h3>
              <p className="text-sm text-zinc-500">Monitor your account activity and credit usage in real-time.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-sm text-zinc-500 mt-12 border-t border-zinc-800 pt-8">
          <p>© {new Date().getFullYear()} Fitbinary Inc.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-md mx-auto flex flex-col my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden size-10 bg-brand-red rounded-xl flex items-center justify-center text-white font-bold text-xl mb-8">
            F
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-zinc-500">
              Please enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-700">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="h-12 pl-10 bg-zinc-50/50 text-gray-800 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-brand-red hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 pl-10 pr-10 text-gray-800 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold h-12 shadow-sm transition-all"
              >
                Sign in
                <ChevronRight className="ml-1 size-4" />
              </Button>

              <div className="text-center text-sm text-zinc-500">
                Don't have an account?{" "}
                <a href="/signup" className="font-semibold text-brand-red hover:underline">
                  Create an account
                </a>
              </div>
            </div>
          </form>

          {/* Footer for mobile only */}
          <div className="lg:hidden flex items-center justify-center gap-4 text-xs text-zinc-400 mt-12 pb-8">
            <a href="#" className="hover:text-zinc-600 transition-colors">Privacy</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-zinc-600 transition-colors">Terms</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-zinc-600 transition-colors">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
}
