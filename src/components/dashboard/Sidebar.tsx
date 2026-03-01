"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  ShieldCheck,
  CreditCard,
  LayoutDashboard,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Personal info", icon: User, href: "/personal-info" },
  { name: "Security", icon: ShieldCheck, href: "/security" },
  { name: "Payments & subscriptions", icon: CreditCard, href: "/payments" },
  { name: "App management", icon: LayoutDashboard, href: "/apps" },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-zinc-400 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col h-full",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-brand-red rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-red/20">
              F
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Fitbinary
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 lg:hidden text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-md transition-all group relative",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "hover:bg-zinc-900/50 hover:text-zinc-200",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-red rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                )}
                <item.icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-brand-red"
                      : "text-zinc-500 group-hover:text-zinc-400",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-zinc-800/50">
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 group cursor-pointer hover:border-brand-red/20 transition-all">
            <p className="text-xs text-zinc-500 mb-1 group-hover:text-zinc-400 transition-colors">
              Credits Available
            </p>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-white tabular-nums">
                $1,240.00
              </span>
              <span className="text-[10px] text-zinc-600 mb-1 font-semibold uppercase tracking-wider">
                USD
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
