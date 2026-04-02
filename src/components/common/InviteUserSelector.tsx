"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, UserPlus, Mail, Phone, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInviteUsersList } from "@/services/users/invite-user.service";
import type { InviteUser } from "@/types/invite-user";

interface InviteUserSelectorProps {
  onSelect: (user: InviteUser) => void;
  trigger?: React.ReactNode;
}

const LIMIT = 20;

export default function InviteUserSelector({
  onSelect,
  trigger,
}: InviteUserSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["invite-users", debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      getInviteUsersList({
        page: pageParam,
        limit: LIMIT,
        search: debouncedSearch || undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNext ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    enabled: open,
  });

  // Infinite scroll via IntersectionObserver
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      threshold: 0.1,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [observerCallback, data]);

  const allUsers = data?.pages.flatMap((page) => page.data) ?? [];

  const handleSelect = (user: InviteUser) => {
    onSelect(user);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            className="flex items-center gap-2 h-10 px-5 bg-zinc-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm cursor-pointer transition-all active:scale-[0.98] shadow-sm"
          >
            <UserPlus size={14} />
            <span>Invite User</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 gap-0 rounded-sm bg-white">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-sm font-black text-zinc-900 uppercase tracking-tight">
            Select User to Invite
          </DialogTitle>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Choose an existing user to pre-fill registration details
          </p>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none"
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0 max-h-[55vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="size-6 animate-spin text-zinc-900" />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Loading users...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-2">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                Failed to load users
              </p>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-2 border-2 border-dashed border-zinc-100 rounded-sm">
              <p className="text-zinc-400 text-sm italic">
                {debouncedSearch
                  ? "No users match your search"
                  : "No users available"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {allUsers.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 text-left rounded-sm border border-zinc-100 transition-all duration-150 group",
                    "hover:border-zinc-900 hover:bg-zinc-50/50 cursor-pointer",
                  )}
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="h-10 w-10 rounded-sm object-cover border border-zinc-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-sm bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                        <span className="text-xs font-black text-zinc-500">
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-black text-zinc-900 truncate tracking-tight leading-tight">
                      {user.first_name} {user.last_name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 truncate">
                        <Mail size={10} className="shrink-0" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 truncate">
                          <Phone size={10} className="shrink-0" />
                          {user.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Select indicator */}
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center">
                      <Check
                        className="h-3.5 w-3.5 text-white"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                </button>
              ))}

              {/* Sentinel for infinite scroll */}
              <div ref={sentinelRef} className="h-1" />

              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-4 animate-spin text-zinc-400" />
                  <span className="ml-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Loading more...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
