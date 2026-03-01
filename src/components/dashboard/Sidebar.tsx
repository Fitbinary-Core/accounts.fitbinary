"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  ShieldCheck,
  CreditCard,
  LayoutDashboard,
  X,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { logoutUser, userProfile } from "@/services/auth/auth.service";
import { get_all_apps } from "@/services/apps/apps.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

// Specific brand colors based on app name
const getBrandStyle = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("fitstock")) {
    return "bg-brand-red text-white border-brand-red";
  }
  if (lowerName.includes("fitcloud")) {
    return "bg-blue-600 text-white border-blue-600";
  }
  return "bg-zinc-800 text-white border-zinc-700";
};

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: profileData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userProfile(),
  });

  const { data: appsData } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
  });

  const applications = appsData?.applications || [];

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/signin");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const tenant = profileData?.tenant;

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
            <div className="size-8 bg-brand-red rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-red/40">
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

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-6 space-y-1">
            <h4 className="px-3 mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Overview
            </h4>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all group relative",
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-800"
                      : "hover:bg-zinc-900/50 hover:text-zinc-200",
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-red rounded-r-full shadow-[2px_0_8px_rgba(239,68,68,0.4)]" />
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
          </div>

          {applications.length > 0 && (
            <div className="py-6 space-y-3">
              <h4 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                My Workspace
              </h4>
              <div className="space-y-1">
                {applications.map((app) => {
                  const brandStyle = getBrandStyle(app.name);
                  return (
                    <button
                      key={app._id}
                      onClick={() => {
                        if (app.baseRoute) {
                          window.open(
                            app.baseRoute,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-zinc-400 hover:bg-zinc-900/50 hover:text-white rounded-xl transition-all group"
                    >
                      <div
                        className={cn(
                          "size-6 rounded-lg flex items-center justify-center overflow-hidden bg-liner-to-br transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                          brandStyle,
                        )}
                      >
                        {app.icon && app.icon.startsWith("http") ? (
                          <img
                            src={app.icon}
                            alt={app.name}
                            className="size-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <span className="text-white text-[10px] font-bold uppercase">
                            {app.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="truncate flex-1 text-left capitalize">
                        {app.name}
                      </span>
                      <ExternalLink className="size-3 text-zinc-700 group-hover:text-brand-red opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-zinc-800/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700/50">
              {tenant?.avatar ? (
                <img
                  src={tenant.avatar}
                  alt={tenant.first_name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="text-zinc-400 font-bold uppercase">
                  {tenant?.first_name?.charAt(0)}
                  {tenant?.last_name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-zinc-100 truncate">
                {tenant?.first_name} {tenant?.last_name}
              </p>
              <p className="text-[11px] text-zinc-500 truncate lowercase">
                {tenant?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-brand-red transition-all"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
