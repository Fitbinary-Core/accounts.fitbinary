"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { Tenant } from "@/services/auth/auth.service";

export interface TenantProps {
  tenant?: Tenant;
}

export function ProfileDropdown({ tenant }: TenantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = () => {
    if (!tenant?.first_name) return "U";
    const first = tenant.first_name.charAt(0).toUpperCase();
    const last = tenant.last_name?.charAt(0).toUpperCase() || "";
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-red text-white font-medium hover:ring-4 hover:ring-red-100 transition-all overflow-hidden"
      >
        {tenant?.avatar ? (
          <img
            src={tenant.avatar}
            alt={tenant.first_name}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
          <div className="p-6 text-center border-b border-gray-100">
            <div className="w-16 h-16 bg-brand-red text-white text-2xl font-bold flex items-center justify-center rounded-full mx-auto mb-3 overflow-hidden">
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
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {tenant ? `${tenant.first_name} ${tenant.last_name}` : "User"}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {tenant?.email || "No email provided"}
            </p>
            <button className="mt-4 px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
              Manage your Fitbinary Account
            </button>
          </div>

          <div className="py-2">
            <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <User className="w-5 h-5 text-gray-500" />
              Your Profile
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-500" />
              Settings
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100">
              <LogOut className="w-5 h-5 text-gray-500" />
              Sign out
            </button>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-[11px] text-gray-500 flex justify-center gap-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
