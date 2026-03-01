"use client";

import { useQuery } from "@tanstack/react-query";
import { userProfile } from "@/services/auth/auth.service";
import { Search, HelpCircle, Bell, Menu } from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";
import { AppLauncher } from "./AppLauncher";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfile(),
  });

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-zinc-600" />
        </button>
      </div>

      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-brand-red transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 h-10 bg-zinc-100/50 border border-transparent rounded-xl focus:bg-white focus:border-zinc-200 focus:ring-4 focus:ring-zinc-100 outline-none transition-all text-sm placeholder:text-zinc-500"
            placeholder="Search resources, settings, help..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="items-center gap-1 border-r border-zinc-200 pr-4 mr-2 hidden sm:flex">
          <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 size-2 bg-brand-red rounded-full border-2 border-white" />
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <AppLauncher />
        </div>
        <ProfileDropdown tenant={data?.tenant} />
      </div>
    </header>
  );
}
