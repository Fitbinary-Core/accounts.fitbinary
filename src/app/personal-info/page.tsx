"use client";

import { userProfile } from "@/services/auth/auth.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Camera,
  Shield,
  CheckCircle2,
} from "lucide-react";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { useState, useRef } from "react";
import { apiClient } from "@/lib/apiClient";
import { COMMON_URLS, TENANT_AUTH_URLS } from "@/lib/urls";

export default function PersonalPage() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfile(),
    staleTime: 1000 * 60 * 60 * 4,
  });

  const tenant = data?.tenant;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      const presignedRes = await apiClient(
        `${COMMON_URLS.get_tenant_avatar_presigned_url}?key=${file.name}`,
        { method: "POST" },
      );
      const { url, key } = await presignedRes.json();

      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image to S3");

      const imageUrl = `https://fitbinary.com.s3.eu-north-1.amazonaws.com/${key}`;

      const updateRes = await apiClient(TENANT_AUTH_URLS.profile_update, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: imageUrl }),
      });

      if (!updateRes.ok) throw new Error("Failed to update profile");

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    if (!tenant?.first_name) return "U";
    const first = tenant.first_name.charAt(0).toUpperCase();
    const last = tenant.last_name?.charAt(0).toUpperCase() || "";
    return `${first}${last}`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-100px)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
            <p className="text-zinc-500 font-medium animate-pulse">
              Loading your profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <DashboardBreadcrumb
            title="Personal Information"
            description="Manage your account details and profile identity across the platform."
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100 shadow-sm self-start md:self-auto">
            <Shield className="w-3.5 h-3.5" />
            Your data is secured
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="h-38 bg-zinc-900">
            <div className="p-4">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {tenant?.first_name} {tenant?.last_name}
              </h1>
              <p className="text-zinc-300 flex items-center gap-2 justify-center md:justify-start">
                {tenant?.email}
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </p>
            </div>
          </div>

          <div className="p-4">
            <div className="relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left space-y-4">
                {/* Avatar Section */}
                <div className="relative group overflow-hidden rounded-full">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden relative">
                      {tenant?.avatar ? (
                        <img
                          src={tenant.avatar}
                          alt={tenant.first_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-zinc-400 group-hover:scale-110 transition-transform duration-500">
                          {getInitials()}
                        </span>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center rounded-full justify-center backdrop-blur-sm">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white rounded-full gap-2 backdrop-blur-[2px]"
                      >
                        <Camera className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Change
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
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
                { label: "Phone", value: tenant?.phone || "---", icon: Phone },
                { label: "Role", value: tenant?.role || "OWNER", icon: User },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-zinc-50 rounded-lg border border-zinc-100 group transition-all hover:bg-white hover:border-brand-red/20 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-md border border-zinc-100 text-zinc-400 group-hover:text-brand-red transition-colors capitalize">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Settings Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-red" />
                Linked Services
              </h2>
              <div className="space-y-4">
                <div className="p-4 flex items-center justify-between border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">
                        Email Address
                      </h4>
                      <p className="text-xs text-zinc-500 font-medium">
                        {tenant?.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    Primary
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 p-4 rounded-lg text-white shadow-xl relative overflow-hidden group">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed font-medium">
                Our support team is available 24/7 to help you with any account
                issues.
              </p>
              <button className="w-full py-3 bg-white text-zinc-900 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
