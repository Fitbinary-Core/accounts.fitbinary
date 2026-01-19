"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { signUpUser } from "@/services/auth/auth.service";

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

export default function SignupForm() {
  const [step, setStep] = useState(1);
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
    const response = await signUpUser(data);
    console.log("Body: ", response);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <Card className="w-full border-0 sm:border shadow-none sm:shadow-lg bg-white overflow-hidden p-6 sm:p-10">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10">
          {/* Left Column: Branding Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="size-12 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
              F
            </div>
            <h1 className="text-4xl font-semibold text-brand-black tracking-tight">
              {step === 1 && "Personal details"}
              {step === 2 && "Contact details"}
              {step === 3 && "Security and password"}
            </h1>
            <p className="text-xl text-brand-black">
              {step === 1 && "Tell us your basic info"}
              {step === 2 && "How can we reach you?"}
              {step === 3 && "Keep your account secure"}
            </p>

            <div className="w-full max-w-xs mt-8">
              <div className="h-1.5 w-full bg-gray-200 rounded-full">
                <div
                  className="h-full bg-brand-red rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                Step {step} of {totalSteps}
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6 p-0 min-h-75">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        id="first_name"
                        placeholder="First Name"
                        className="py-6 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                        {...register("first_name")}
                      />
                      {errors.first_name && (
                        <p className="text-xs text-brand-red font-medium px-1">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="last_name"
                        placeholder="Last Name"
                        className="py-6 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                        {...register("last_name")}
                      />
                      {errors.last_name && (
                        <p className="text-xs text-brand-red font-medium px-1">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      id="middle_name"
                      placeholder="Middle Name (Optional)"
                      className="py-6 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                      {...register("middle_name")}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-red" />
                      <Input
                        id="dob"
                        type="date"
                        className="py-6 pl-10 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                        {...register("dob")}
                      />
                    </div>
                    {errors.dob && (
                      <p className="text-xs text-brand-red font-medium px-1">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-red" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        className="py-6 pl-10 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-brand-red font-medium px-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-red" />
                      <Input
                        id="phone"
                        placeholder="Phone Number"
                        className="py-6 pl-10 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-brand-red font-medium px-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-red" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="py-6 pl-10 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                        {...register("password")}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-brand-red font-medium px-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-red" />
                      <Input
                        id="confirm_password"
                        type="password"
                        placeholder="Confirm Password"
                        className="py-6 pl-10 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                        {...register("confirm_password")}
                      />
                    </div>
                    {errors.confirm_password && (
                      <p className="text-xs text-brand-red font-medium px-1">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-10">
                <div className="flex gap-2">
                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="font-semibold text-white bg-brand-red h-12 cursor-pointer hover:bg-red-600"
                    >
                      <ChevronLeft />
                      Back
                    </Button>
                  )}
                  <a
                    href="/signin"
                    className="text-sm text-brand-red font-semibold hover:underline flex items-center h-12 px-4"
                  >
                    Sign in instead
                  </a>
                </div>

                {step < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    size="lg"
                    className="bg-brand-red cursor-pointer hover:bg-red-700 text-white font-semibold px-8 h-12"
                  >
                    Next
                    <ChevronRight />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-brand-red hover:bg-red-700 text-white font-semibold px-8 h-12"
                  >
                    Create
                  </Button>
                )}
              </div>
            </CardContent>
          </form>
        </div>
      </Card>

      {/* Footer */}
      <div className="w-full mt-6 px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4 pb-10">
        <div className="flex items-center gap-1 px-3 py-1 rounded-md cursor-pointer transition-colors text-brand-black font-medium">
          English (United States) <ChevronDown className="size-4" />
        </div>
        <div className="flex gap-4 font-medium text-brand-black">
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
      </div>
    </div>
  );
}
