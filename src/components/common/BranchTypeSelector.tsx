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
  ShoppingBasket,
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
  "Retail Store": Store,
  Warehouse: Warehouse,
  "Distribution Center": Truck,
  "Head Office": Building2,
  "Online / E-commerce Branch": Monitor,
  "Franchise Outlet": ShoppingBag,
  "Manufacturing Unit": Factory,
  Showroom: Store,
  "Service Center": Wrench,
  "Dark Store": Package,
  "Pickup Point": Map,
  "Fulfillment Center": Package,
  "Regional Office": Briefcase,
  "Wholesale Outlet": ShoppingBasket,
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
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search branch types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-5.5 rounded-sm border-gray-200 focus:border-red-500 focus:ring-red-500 text-gray-800"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredTypes.length === 0 ? (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-400 text-sm italic">
              No branch types match your search.
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
                  "flex items-center gap-3 p-4 text-left rounded-lg border-2 transition-all duration-200 group relative cursor-pointer",
                  isSelected
                    ? "border-red-500 bg-red-50/50 ring-1 ring-red-500/20"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isSelected
                      ? "bg-red-500 text-white"
                      : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600",
                  )}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 pr-6">
                  <p
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isSelected ? "text-red-900" : "text-gray-700",
                    )}
                  >
                    {type}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
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
