"use client";

import { useQuery } from "@tanstack/react-query";
import { userProfile } from "@/services/auth/auth.service";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { AccountCard } from "@/components/dashboard/AccountCard";
import {
  ShieldCheck,
  User,
  Database,
  Settings,
  Eye,
  Smartphone,
  Info,
} from "lucide-react";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfile(),
  });

  const tenant = data?.tenant;

  const getInitials = () => {
    if (!tenant?.first_name) return "U";
    const first = tenant.first_name.charAt(0).toUpperCase();
    const last = tenant.last_name?.charAt(0).toUpperCase() || "";
    return `${first}${last}`;
  };

  const initials = getInitials();

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-red text-white text-3xl font-bold flex items-center justify-center rounded-full mx-auto mb-6 shadow-sm overflow-hidden">
            {tenant?.avatar ? (
              <img
                src={tenant.avatar}
                alt={tenant.first_name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-normal text-brand-black mb-2">
            Welcome, {tenant?.first_name || "User"}
          </h1>
          <div className="mb-4">
            <p className="text-gray-600 font-medium">
              {tenant ? `${tenant.first_name} ${tenant.last_name}` : ""}
            </p>
            <p className="text-gray-700 text-xl font-semibold">
              {tenant?.email}
            </p>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your info, privacy, and security to make Fitbinary work
            better for you.
            <a href="#" className="text-brand-red hover:underline ml-1">
              Learn more
            </a>
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountCard
            title="Privacy & personalization"
            description="See the data in your Fitbinary Account and choose what activity is saved to personalize your Fitbinary experience"
            icon={Database}
            linkText="Manage your data & privacy"
          />
          <AccountCard
            title="Security recommendations"
            description="Recommended actions found in the Security Checkup"
            icon={ShieldCheck}
            linkText="Protect your account"
          />
          <AccountCard
            title="Personal info"
            description="See your personal info like your email address and phone number"
            icon={User}
            linkText="Manage personal info"
          />
          <AccountCard
            title="Payments & subscriptions"
            description="Your payment info, transactions, recurring payments, and reservations"
            icon={Settings}
            linkText="Manage payments"
          />
        </div>

        {/* Info Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-red-50 flex items-center justify-center rounded-full shrink-0">
            <Smartphone className="w-8 h-8 text-brand-red" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Take the Privacy Checkup
            </h3>
            <p className="text-gray-600 text-sm">
              This step-by-step guide helps you choose the privacy settings that
              are right for you.
            </p>
          </div>
          <button className="px-6 py-2 bg-brand-red text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors shrink-0">
            Get started
          </button>
        </div>

        {/* Footer/Subtext */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Info className="w-4 h-4" />
            <span>
              Only you can see your settings. You might also want to review your
              settings for Fitbinary services.
            </span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">
              Help
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
