"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpUser } from "@/services/auth/auth.service";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signUpUser,
    onSuccess: (response) => {
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
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  const nextStep = async () => {
    let fields: (keyof SignupValues)[] = [];
    if (step === 1) fields = ["first_name", "last_name", "dob"];
    if (step === 2) fields = ["email", "phone"];

    const isValid = await trigger(fields);
    if (isValid) setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data: SignupValues) => {
    signup(data);
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-zinc-900 selection:text-white">
      {/* Left Panel - Auth Form */}
      <div className="w-full md:w-[50%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 border-r border-zinc-100 overflow-y-auto">
        <div className="w-full max-w-100 mx-auto py-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
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
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Create account
              </h1>
              <span className="bg-zinc-100 text-zinc-600 text-xs font-bold px-2.5 py-1 rounded-md">
                {step} / {totalSteps}
              </span>
            </div>
            <p className="text-zinc-500">
              {step === 1 && "Let's start with your basic information."}
              {step === 2 && "How can we reach you?"}
              {step === 3 && "Set a password to secure your account."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="first_name"
                      className="text-sm font-medium text-zinc-900"
                    >
                      First Name
                    </label>
                    <Input
                      id="first_name"
                      placeholder="John"
                      className="h-11 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                      {...register("first_name")}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last_name"
                      className="text-sm font-medium text-zinc-900"
                    >
                      Last Name
                    </label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      className="h-11 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
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
                  <label
                    htmlFor="dob"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Date of Birth
                  </label>
                  <Input
                    id="dob"
                    type="date"
                    className="h-11 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm px-3"
                    {...register("dob")}
                  />
                  {errors.dob && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.dob.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="h-11 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Phone number
                  </label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    className="h-11 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
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
                      className="h-11 pr-10 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors p-1"
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
                  <label
                    htmlFor="confirm_password"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 pr-10 bg-white border-zinc-200 text-zinc-900 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                      {...register("confirm_password")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors p-1"
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

            <div className="pt-4 flex items-center justify-between gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 lg:flex-none lg:w-32 border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium h-11 rounded-lg transition-colors"
                >
                  Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-11 rounded-lg transition-colors group flex items-center justify-center gap-2 w-full lg:w-auto ml-auto"
                >
                  Continue
                  <ArrowRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-11 rounded-lg transition-colors disabled:opacity-50 w-full lg:w-auto ml-auto"
                >
                  {isPending ? "Creating account..." : "Complete Signup"}
                </Button>
              )}
            </div>
          </form>

          {step === 1 && (
            <div className="mt-8 text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-zinc-900 hover:underline"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-zinc-950 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[#18181b] bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,#000_60%,transparent_100%)]" />

        <div className="relative z-10 text-zinc-400 font-medium tracking-wide text-sm uppercase">
          Join Fitbinary
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-8">
            Access elite tools.
            <br />
            Empower your team.
            <br />
            Move faster.
          </h2>

          <div className="flex flex-col gap-4 mt-6">
            {[
              {
                title: "Unified Dashboard",
                desc: "Instantly control every aspect of your app ecosystem.",
              },
              {
                title: "Team Collaboration",
                desc: "Granular access controls and activity logs.",
              },
              {
                title: "Enterprise Grade",
                desc: "Built for scale, security, and reliability.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col border-l-2 border-zinc-800 pl-4 py-1"
              >
                <span className="text-white font-semibold text-sm mb-1">
                  {feature.title}
                </span>
                <span className="text-zinc-500 text-sm">{feature.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-zinc-800 pt-8 mt-8 max-w-lg">
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`size-10 rounded-full border-2 border-[#18181b] flex items-center justify-center text-xs font-bold text-white ${
                  i === 1
                    ? "bg-zinc-700"
                    : i === 2
                      ? "bg-zinc-600"
                      : i === 3
                        ? "bg-zinc-800"
                        : "bg-zinc-900"
                }`}
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-zinc-400">
            Join thousands of enterprise teams already scaling with Fitbinary.
          </p>
        </div>
      </div>
    </div>
  );
}
