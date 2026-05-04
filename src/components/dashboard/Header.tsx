"use client";

import { useQuery } from "@tanstack/react-query";
import { userProfile } from "@/services/auth/auth.service";
import { Search, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";
import { AppLauncher } from "./AppLauncher";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { getMyWorkspaces } from "@/services/accesscontrol/accesscontrol.service";

interface HeaderProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Header({
  toggleSidebar,
  isCollapsed,
  setIsCollapsed,
}: HeaderProps) {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfile(),
    staleTime: 1000 * 60 * 60 * 1,
  });

  const { data: workspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => getMyWorkspaces()
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

      <div className="hidden lg:flex items-center gap-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
          title={
            isCollapsed
              ? "Expand Sidebar (Ctrl+B)"
              : "Collapse Sidebar (Ctrl+B)"
          }
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-brand-red" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
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
          <WorkspaceSelector workspaces={workspaces?.workspaces ?? []} />
          <AppLauncher />
        </div>
        <ProfileDropdown user={data?.user} />
      </div>
    </header>
  );
}
