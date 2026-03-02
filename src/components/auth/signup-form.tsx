"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, Calendar, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpUser } from "@/services/auth/auth.service";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-115">
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
                {step === 1 && "Basic Information"}
                {step === 2 && "Contact Details"}
                {step === 3 && "Security"}
              </h1>
              <p className="text-zinc-500 text-sm">
                {step === 1 && "Step 1 of 3"}
                {step === 2 && "Step 2 of 3"}
                {step === 3 && "Step 3 of 3"}
              </p>
            </div>

            {/* Flat Step Indicator */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 transition-all duration-300 ${
                    i <= step ? "bg-zinc-950" : "bg-zinc-100"
                  }`}
                />
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="first_name"
                        className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                      >
                        First Name
                      </label>
                      <Input
                        id="first_name"
                        placeholder="John"
                        className="h-10 text-gray-900 bg-white border-zinc-200 rounded-md focus:ring-0 focus:border-zinc-900 transition-all text-sm"
                        {...register("first_name")}
                      />
                      {errors.first_name && (
                        <p className="text-[11px] text-red-600 font-medium">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="last_name"
                        className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                      >
                        Last Name
                      </label>
                      <Input
                        id="last_name"
                        placeholder="Doe"
                        className="h-10 text-gray-900 bg-white border-zinc-200 rounded-md focus:ring-0 focus:border-zinc-900 transition-all text-sm"
                        {...register("last_name")}
                      />
                      {errors.last_name && (
                        <p className="text-[11px] text-red-600 font-medium">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="dob"
                      className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                    >
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <Input
                        id="dob"
                        type="date"
                        className="h-10 pl-9 bg-white border-zinc-200 rounded-md focus:ring-0 focus:border-zinc-900 transition-all text-sm text-zinc-900"
                        {...register("dob")}
                      />
                    </div>
                    {errors.dob && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        className="h-10 pl-9 bg-white text-gray-900 border-zinc-200 rounded-md focus:ring-0 focus:border-zinc-900 transition-all text-sm"
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
                    <label
                      htmlFor="phone"
                      className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        className="h-10 pl-9 bg-white text-gray-900 border-zinc-200 rounded-md focus:ring-0 focus:border-zinc-900 transition-all text-sm"
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="password"
                      className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-10 pl-9 pr-9 text-gray-900 bg-white border-zinc-200 rounded-md focus:ring-0 focus:border-zinc-900 transition-all text-sm"
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

                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirm_password"
                      className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-10 pl-9 pr-9 text-gray-900 bg-white border-zinc-200 rounded-md focus:ring-0 focus:border-zinc-900 transition-all text-sm"
                        {...register("confirm_password")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-zinc-100 mt-6 bg-transparent">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    className="font-bold text-zinc-400 hover:text-zinc-900 h-10 px-4 rounded-md transition-all"
                  >
                    Back
                  </Button>
                ) : (
                  <div className="text-sm text-zinc-500">
                    <a
                      href="/signin"
                      className="font-bold text-zinc-900 hover:underline"
                    >
                      Sign in instead
                    </a>
                  </div>
                )}

                {step < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-10 px-6 rounded-md transition-all"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold h-10 px-6 rounded-md transition-all disabled:opacity-70"
                  >
                    {isPending ? "Creating account..." : "Create Account"}
                  </Button>
                )}
              </div>
            </form>
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
              Support
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
