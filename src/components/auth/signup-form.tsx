"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Phone,
  Calendar,
  Lock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpUser } from "@/services/auth/auth.service";
import toast from "react-hot-toast";

const signupSchema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(2, "Last name is required"),
    dob: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Valid date of birth is required",
      ),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupForm({
  redirectUri,
}: {
  redirectUri: string | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    let fields: (keyof SignupValues)[] = [];
    if (step === 1) fields = ["first_name", "last_name", "dob"];
    if (step === 2) fields = ["email", "phone"];

    const isValid = await trigger(fields);
    if (isValid) setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: SignupValues) => {
    try {
      const response = await signUpUser(data);
      toast.success(response.message);

      if (redirectUri) {
        toast.loading("Redirecting to your app...", { duration: 2000 });
      }

      setTimeout(() => {
        if (redirectUri) {
          window.location.href = redirectUri;
        } else {
          router.push("/signin");
        }
      }, 2000);
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
            Manage your entire organization from one central hub.
          </h1>
          <p className="text-lg text-zinc-400 max-w-lg">
            Create your Fitbinary account to provision users, manage billing, and oversee multiple environments with enterprise-grade controls.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="size-6 text-brand-red shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-200">Centralized Identity</h3>
              <p className="text-sm text-zinc-500">Unified access management across all your workspaces.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle2 className="size-6 text-brand-red shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-200">Granular Permissions</h3>
              <p className="text-sm text-zinc-500">Assign precise roles and access levels to every team member.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle2 className="size-6 text-brand-red shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-200">Unified Billing</h3>
              <p className="text-sm text-zinc-500">Manage invoices, credits, and payment methods in one place.</p>
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
              {step === 1 && "Create your account"}
              {step === 2 && "Contact details"}
              {step === 3 && "Secure your account"}
            </h2>
            <p className="text-zinc-500">
              {step === 1 && "Enter your personal details to get started."}
              {step === 2 && "How should we reach you?"}
              {step === 3 && "Set a strong password for your new account."}
            </p>
          </div>

          {/* Minimal Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-brand-red" : "bg-zinc-100"
                  }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-medium text-zinc-700">First Name</label>
                    <Input
                      id="first_name"
                      placeholder="John"
                      className="h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
                      {...register("first_name")}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-medium text-zinc-700">Last Name</label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      className="h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
                      {...register("last_name")}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="middle_name" className="text-sm font-medium text-zinc-700">Middle Name <span className="text-zinc-400 font-normal">(Optional)</span></label>
                  <Input
                    id="middle_name"
                    placeholder="Middle Name"
                    className="h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
                    {...register("middle_name")}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dob" className="text-sm font-medium text-zinc-700">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <Input
                      id="dob"
                      type="date"
                      className="h-12 pl-10 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all text-zinc-700"
                      {...register("dob")}
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.dob.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-700">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      className="h-12 pl-10 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
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
                  <label htmlFor="phone" className="text-sm font-medium text-zinc-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      className="h-12 pl-10 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pl-10 pr-10 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
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

                <div className="space-y-2">
                  <label htmlFor="confirm_password" className="text-sm font-medium text-zinc-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pl-10 pr-10 bg-zinc-50/50 border-zinc-200 focus-visible:ring-brand-red/20 focus-visible:border-brand-red transition-all"
                      {...register("confirm_password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-zinc-100 mt-8">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  className="font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 h-11 px-4"
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Back
                </Button>
              ) : (
                <div className="text-sm text-zinc-500">
                  Already have an account?{" "}
                  <a href="/signin" className="font-semibold text-brand-red hover:underline">
                    Sign in
                  </a>
                </div>
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold h-11 px-6 shadow-sm shadow-brand-red/20 transition-all"
                >
                  Next step
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold h-11 px-8 shadow-sm transition-all"
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>

          {/* Footer for mobile only */}
          <div className="lg:hidden flex items-center justify-center gap-4 text-xs text-zinc-400 mt-12">
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
