"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  CreditCard,
  LayoutDashboard,
  X,
  LogOut,
  ExternalLink,
  Users,
  ChevronDown,
  ChevronUp,
  Shield,
  Building2,
  GitBranch,
  List,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import Modal from "@/components/common/modal";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { logoutUser, userProfile } from "@/services/auth/auth.service";
import { get_all_apps } from "@/services/apps/apps.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Personal info", icon: User, href: "/personal-info" },
  { name: "Payments & subscriptions", icon: CreditCard, href: "/payments" },
  { name: "App management", icon: LayoutDashboard, href: "/apps" },
  {
    name: "Organization",
    icon: Building2,
    href: "/organization",
    subItems: [
      { name: "List", icon: List, href: "/organization/list" },
      {
        name: "Create",
        icon: PlusCircle,
        href: "/organization/create",
      },
    ],
  },
  {
    name: "Branches",
    icon: GitBranch,
    href: "/branches",
    subItems: [
      { name: "List", icon: List, href: "/branches" },
      {
        name: "Create",
        icon: PlusCircle,
        href: "/branches/create",
      },
    ],
  },
  {
    name: "User management",
    icon: Users,
    href: "/user-management",
    subItems: [
      { name: "Users list", icon: User, href: "/user-management/users" },
      {
        name: "Roles and permissions",
        icon: Shield,
        href: "/user-management/roles",
      },
    ],
  },
];

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

export function Sidebar({ isOpen, setIsOpen, isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isCollapsed) return;
    const currentMenu = navItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((sub) => pathname.startsWith(sub.href)),
    );
    if (currentMenu && !expandedMenus.includes(currentMenu.name)) {
      setExpandedMenus((prev) => [...prev, currentMenu.name]);
    }
  }, [pathname, isCollapsed]);

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfile(),
    staleTime: 1000 * 60 * 60 * 1,
  });

  const { data: appsData } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => get_all_apps(),
    staleTime: 1000 * 60 * 60 * 10,
  });

  const applications = appsData?.applications || [];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/signin");
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const user = profileData?.user;

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
          "fixed lg:relative inset-y-0 left-0 z-50 bg-zinc-950 text-zinc-400 border-r border-zinc-800 transform transition-all duration-300 ease-in-out lg:transform-none flex flex-col h-full overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex items-center h-16 px-4 mb-4",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <div className="size-8 bg-black rounded-full flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                <img
                  src="/Icon.png"
                  alt="Fitbinary"
                  className="size-full object-cover"
                />
              </div>
              <span className="text-md font-bold text-white tracking-tight truncate">
                Fitbinary Accounts
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="size-8 bg-black rounded-full flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              <img
                src="/Icon.png"
                alt="Fitbinary"
                className="size-full object-cover"
              />
            </div>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 lg:hidden text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className="mb-6 space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap">
                Overview
              </h4>
            )}
            {navItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus.includes(item.name);
              const isActive =
                pathname === item.href ||
                (hasSubItems &&
                  item.subItems?.some((sub) => pathname === sub.href));

              if (hasSubItems) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => !isCollapsed && toggleMenu(item.name)}
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all group relative",
                        isCollapsed ? "justify-center px-0" : "justify-between",
                        isActive
                          ? "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-800"
                          : "hover:bg-zinc-900/50 hover:text-zinc-200",
                      )}
                      title={isCollapsed ? item.name : ""}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "w-4 h-4 transition-colors shrink-0",
                            isActive
                              ? "text-brand-red"
                              : "text-zinc-500 group-hover:text-zinc-400",
                          )}
                        />
                        {!isCollapsed && <span>{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-zinc-600" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                          )}
                        </>
                      )}
                    </button>
                    {isExpanded && !isCollapsed && (
                      <div className="ml-4 pl-3 border-l border-zinc-800 space-y-1 mt-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 text-[12px] font-medium rounded-lg transition-all group",
                                isSubActive
                                  ? "text-white bg-zinc-900/50"
                                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/30",
                              )}
                            >
                              <subItem.icon
                                className={cn(
                                  "w-3.5 h-3.5 transition-colors shrink-0",
                                  isSubActive
                                    ? "text-brand-red"
                                    : "text-zinc-600 group-hover:text-zinc-400",
                                )}
                              />
                              <span>{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all group relative",
                    isCollapsed ? "justify-center px-0" : "gap-3",
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-800"
                      : "hover:bg-zinc-900/50 hover:text-zinc-200",
                  )}
                  title={isCollapsed ? item.name : ""}
                >
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-red rounded-r-full" />
                  )}
                  <item.icon
                    className={cn(
                      "w-4 h-4 transition-colors shrink-0",
                      isActive
                        ? "text-brand-red"
                        : "text-zinc-500 group-hover:text-zinc-400",
                    )}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {applications.length > 0 && (
            <div className="py-2 space-y-3">
              {!isCollapsed && (
                <h4 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap">
                  My Workspace
                </h4>
              )}
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
                      className={cn(
                        "w-full flex items-center px-3 py-2 text-[13px] font-medium text-zinc-400 hover:bg-zinc-900/50 hover:text-white rounded-xl transition-all group",
                        isCollapsed ? "justify-center px-0" : "gap-3",
                      )}
                      title={isCollapsed ? app.name : ""}
                    >
                      <div
                        className={cn(
                          "size-6 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shrink-0",
                          brandStyle,
                        )}
                      >
                        <img
                          src="/Icon.png"
                          alt={app.name}
                          className="size-full object-cover"
                        />
                      </div>
                      {!isCollapsed && (
                        <>
                          <span className="truncate flex-1 text-left capitalize">
                            {app.name}
                          </span>
                          <ExternalLink className="size-3 text-zinc-700 group-hover:text-brand-red opacity-0 group-hover:opacity-100 transition-all" />
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-zinc-800/50">
          <div
            className={cn(
              "flex items-center p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/50 transition-all",
              isCollapsed ? "justify-center px-2" : "gap-3",
            )}
            title={
              isCollapsed ? `${user?.first_name} ${user?.last_name}` : ""
            }
          >
            <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700/50 shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.first_name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="text-zinc-400 font-bold uppercase">
                  {user?.first_name?.charAt(0)}
                  {user?.last_name?.charAt(0)}
                </div>
              )}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-zinc-100 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate lowercase">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-brand-red transition-all"
                  title="Sign out"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="mt-2 w-full flex justify-center p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-brand-red transition-all"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        maxWidth="md"
      >
        <div className="py-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-md flex items-center justify-center text-brand-red shrink-0">
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
            Are you sure you want to sign out? You'll need to sign back in to
            access your account and manage your data.
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
      </Modal>
    </>
  );
}
