"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  Search,
  Building2,
  Store,
  Warehouse,
  Truck,
  Monitor,
  Factory,
  Wrench,
  ShoppingBag,
  Package,
  Map,
  Briefcase,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BRANCH_TYPES } from "@/schemas/branch";

type BranchType = (typeof BRANCH_TYPES)[number];

interface BranchTypeSelectorProps {
  value: BranchType | string;
  onChange: (value: BranchType) => void;
  disabled?: boolean;
}

const typeIcons: Record<BranchType, any> = {
  "Head Office": Building2,
  "Branch Office": Building2,
  "Retail Outlet": Store,
  Warehouse: Warehouse,
  "Distribution Center": Truck,
  "Operations Center": Monitor,
  "Service Center": Wrench,
  "Fulfillment Center": Package,
  "Pickup Point": Map,
  Showroom: Store,
  "Franchise Location": ShoppingBag,
  "Production Unit": Factory,
  "Regional Office": Briefcase,
  "Storage Facility": Package,
  Other: Building2,
};

const BranchTypeSelector: React.FC<BranchTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTypes = useMemo(() => {
    return BRANCH_TYPES.filter((type) =>
      type.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
          <Search size={14} />
        </span>
        <Input
          placeholder="Search infrastructure types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-11 pl-9 border-zinc-200 focus:border-zinc-900 focus:ring-0 text-zinc-900 text-sm placeholder:text-zinc-300 rounded-sm shadow-none"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTypes.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-zinc-200 rounded-sm bg-zinc-50/50">
            <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest italic">
              No registry matches found.
            </p>
          </div>
        ) : (
          filteredTypes.map((type) => {
            const isSelected = value === type;
            const Icon = typeIcons[type] || Building2;

            return (
              <button
                key={type}
                type="button"
                disabled={disabled}
                onClick={() => onChange(type)}
                className={cn(
                  "flex items-center gap-3 p-3 text-left rounded-sm border transition-all duration-200 group relative cursor-pointer shadow-none",
                  isSelected
                    ? "border-zinc-900 bg-zinc-900 text-white z-10"
                    : "border-zinc-100 bg-white hover:border-zinc-400 hover:bg-zinc-50/50",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-sm transition-colors",
                    isSelected
                      ? "bg-white/10 text-white"
                      : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-900",
                  )}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 pr-6">
                  <p
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-tight transition-colors",
                      isSelected ? "text-white" : "text-zinc-600",
                    )}
                  >
                    {type}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BranchTypeSelector;
