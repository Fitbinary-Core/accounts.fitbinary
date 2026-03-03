"use client";

import { userProfile } from "@/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import { User, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { DashboardLayout } from "@/components/dashboard/Layout";

export default function PersonalPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfile(),
  });

  const tenant = data?.tenant;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title="Personal Information"
          description="Manage the basic information used across the Fitbinary dashboard."
        />

        <div className="grid gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 mb-1">
                Basic Profile
              </h2>
              <p className="text-sm text-zinc-500">
                Some info may be visible to other people using Fitbinary
                services.
              </p>
            </div>
            <div className="divide-y divide-zinc-100">
              {isLoading ? (
                <div className="p-12 flex items-center justify-center text-zinc-400">
                  <Loader2 className="size-6 animate-spin mr-2" />
                  <span className="text-sm font-medium">
                    Loading profile...
                  </span>
                </div>
              ) : (
                <>
                  {[
                    {
                      label: "Photo",
                      value: tenant?.avatar
                        ? "View or change your photo"
                        : "A photo helps personalize your account",
                      icon: User,
                    },
                    {
                      label: "Name",
                      value: tenant
                        ? `${tenant.first_name} ${tenant.middle_name ? tenant.middle_name + " " : ""}${tenant.last_name}`
                        : "---",
                      icon: User,
                    },
                    {
                      label: "Birthday",
                      value: tenant?.dob
                        ? new Date(tenant.dob).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                        : "---",
                      icon: Calendar,
                    },
                    { label: "Gender", value: "Not specified", icon: User },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest w-24">
                          {item.label}
                        </span>
                        <span className="text-sm font-medium text-zinc-900">
                          {item.value}
                        </span>
                      </div>
                      <item.icon className="size-4 text-zinc-300 group-hover:text-brand-red transition-colors" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 mb-1">
                Contact Information
              </h2>
              <p className="text-sm text-zinc-500">
                Manage your primary and recovery contact methods.
              </p>
            </div>
            <div className="divide-y divide-zinc-100">
              {isLoading ? (
                <div className="p-12 flex items-center justify-center text-zinc-400">
                  <Loader2 className="size-6 animate-spin mr-2" />
                  <span className="text-sm font-medium">
                    Loading contact info...
                  </span>
                </div>
              ) : (
                <>
                  {[
                    {
                      label: "Email",
                      value: tenant?.email || "---",
                      icon: Mail,
                    },
                    {
                      label: "Phone",
                      value: tenant?.phone || "---",
                      icon: Phone,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest w-24">
                          {item.label}
                        </span>
                        <span className="text-sm font-medium text-zinc-900">
                          {item.value}
                        </span>
                      </div>
                      <item.icon className="size-4 text-zinc-300 group-hover:text-brand-red transition-colors" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
