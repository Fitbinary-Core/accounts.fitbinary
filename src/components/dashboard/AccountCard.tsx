"use client";

import { useRouter } from "next/navigation";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  linkText: string;
  className?: string;
  path?: string;
}

export function AccountCard({
  title,
  description,
  icon: Icon,
  linkText,
  className,
  path,
}: AccountCardProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "group bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col h-full hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-300 transition-all cursor-pointer relative overflow-hidden",
        className,
      )}
      onClick={() => path && router.push(path)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-red/5 transition-colors duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
          <div className="size-12 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red transition-all duration-300 shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
          <div className="size-8 rounded-full bg-zinc-50 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight group-hover:text-brand-red transition-colors">
            {title}
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed pr-2">
            {description}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 group-hover:text-brand-red uppercase tracking-wider transition-colors">
            {linkText}
          </span>
        </div>
      </div>
    </div>
  );
}
