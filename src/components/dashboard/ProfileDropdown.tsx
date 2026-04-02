"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, X, AlertCircle, Camera, Loader2 } from "lucide-react";
import { logoutUser } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { User as UserType } from "@/types/auth";
import { AUTH_URLS, COMMON_URLS, TENANT_AUTH_URLS } from "@/lib/urls";
import { apiClient } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

export interface UserProps {
  user?: UserType;
}

export function ProfileDropdown({ user }: UserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const getInitials = () => {
    if (!user?.first_name) return "U";
    const first = user?.first_name.charAt(0).toUpperCase();
    const last = user?.last_name?.charAt(0).toUpperCase() || "";
    return `${first}${last}`;
  };

  const initials = getInitials();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      queryClient.invalidateQueries();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

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

      // 1. Get presigned URL
      const presignedRes = await apiClient(
        `${COMMON_URLS.get_user_avatar_presigned_url}?key=${file.name}`,
        {
          method: "POST",
        },
      );
      const { url, key } = await presignedRes.json();

      // 2. Upload to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image to S3");

      const imageUrl = `https://fitbinary.com.s3.eu-north-1.amazonaws.com/${key}`;

      // 3. Update tenant profile
      const updateRes = await apiClient(AUTH_URLS.avatar, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-red text-white font-medium hover:ring-4 hover:ring-red-100 transition-all overflow-hidden"
      >
        {user?.avatar ? (
          <img
            src={user?.avatar}
            alt={user?.first_name}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
          <div className="p-6 text-center border-b border-gray-100">
            <div className="relative w-16 h-16 mx-auto mb-3 group/avatar">
              <div className="w-16 h-16 bg-brand-red text-white text-2xl font-bold flex items-center justify-center rounded-full overflow-hidden border-2 border-white shadow-sm">
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt={user?.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full shadow-lg hover:cursor-pointer flex items-center justify-center text-gray-600 hover:text-brand-red transition-colors opacity-0 group-hover/avatar:opacity-100"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {user ? `${user?.first_name} ${user?.last_name}` : "User"}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {user?.email || "No email provided"}
            </p>
          </div>

          <div className="py-2">
            <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <User className="w-5 h-5 text-gray-500" />
              Your Profile
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
            >
              <LogOut className="w-5 h-5 text-gray-500" />
              Sign out
            </button>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-[11px] text-gray-500 flex justify-center gap-4">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal &&
        createPortal(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => !isLoggingOut && setShowLogoutModal(false)}
            />
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-red-50 rounded-md flex items-center justify-center text-brand-red">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    disabled={isLoggingOut}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Sign out?
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Are you sure you want to sign out? You'll need to sign back in
                  to access your account and manage your data.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    disabled={isLoggingOut}
                    className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-brand-red hover:bg-red-700 rounded-lg transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      "Sign out"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
