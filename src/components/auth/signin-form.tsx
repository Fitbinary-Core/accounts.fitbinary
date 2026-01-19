"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Lock,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="w-full max-w-4xl flex flex-col items-center">
      <Card className="w-full border-0 sm:border shadow-none sm:shadow-lg bg-white overflow-hidden p-6 sm:p-10">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10">
          {/* Left Column: Branding Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="size-12 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
              F
            </div>
            <h1 className="text-4xl font-semibold text-brand-black tracking-tight">
              Sign in
            </h1>
            <p className="text-xl text-brand-black">
              Use your Fitbinary Account
            </p>

            <div className="hidden md:flex flex-col space-y-4 mt-8">
              <p className="text-sm text-gray-600 leading-relaxed">
                Not your computer? Use Guest mode to sign in privately.{" "}
                <a
                  href="#"
                  className="text-brand-red font-semibold hover:underline"
                >
                  Learn more about using Guest mode
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6 p-0">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-red" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email or phone"
                    className="py-6 pl-10 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-brand-red font-medium pl-1">
                    {errors.email.message}
                  </p>
                )}
                <div className="pl-1">
                  <a
                    href="#"
                    className="text-sm text-brand-red font-semibold hover:underline"
                  >
                    Forgot email?
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-red" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="py-6 pl-10 pr-10 border border-brand-red/80 text-brand-red focus-visible:ring-brand-red"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-red hover:text-red-700 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-brand-red font-medium pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="md:hidden">
                <p className="text-sm text-muted-foreground">
                  Not your computer? Use Guest mode to sign in privately.{" "}
                  <a
                    href="#"
                    className="text-brand-red font-semibold hover:underline"
                  >
                    Learn more
                  </a>
                </p>
              </div>

              <div className="flex items-center justify-between pt-6">
                <a
                  href="/signup"
                  className="text-sm text-brand-red font-semibold hover:underline"
                >
                  Create account
                </a>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-brand-red cursor-pointer hover:bg-red-700 text-white font-semibold px-8 h-12"
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </CardContent>
          </form>
        </div>
      </Card>

      {/* Footer */}
      <div className="w-full mt-6 px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
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
