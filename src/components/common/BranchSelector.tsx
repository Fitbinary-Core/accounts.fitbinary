"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  Search,
  X,
  Building2,
  MapPin,
  CheckSquare,
  Square,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Branch {
  _id: string;
  branch_name: string;
  branch_location: string;
  is_main?: boolean;
}

type BranchSelectorProps = {
  branches: Branch[];
  disabled?: boolean;
  placeholder?: string;
} & (
  | {
      multi: true;
      value: string[] | undefined;
      onChange: (ids: string[]) => void;
    }
  | {
      multi: false;
      value: string | undefined | null;
      onChange: (id: string | null) => void;
    }
);

const BranchSelector: React.FC<BranchSelectorProps> = (props) => {
  const {
    branches = [],
    disabled = false,
    placeholder = "Search branches...",
  } = props;

  const [searchTerm, setSearchTerm] = useState("");

  const branchesList = useMemo(() => {
    const list = Array.isArray(branches) ? branches : [];
    if (!searchTerm) return list;
    return list.filter(
      (b) =>
        b.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.branch_location.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [branches, searchTerm]);

  const selectedBranchIds = useMemo(() => {
    if (props.multi) {
      return Array.isArray(props.value) ? props.value : [];
    }
    return props.value ? [props.value] : [];
  }, [props.value, props.multi]);

  const toggleBranch = (branchId: string) => {
    if (disabled) return;

    if (props.multi) {
      const currentValues = Array.isArray(props.value) ? props.value : [];
      const isSelected = currentValues.includes(branchId);
      if (isSelected) {
        props.onChange(currentValues.filter((id) => id !== branchId));
      } else {
        props.onChange([...currentValues, branchId]);
      }
    } else {
      const isSelected = props.value === branchId;
      props.onChange(isSelected ? null : branchId);
    }
  };

  const handleSelectAll = () => {
    if (disabled || !props.multi) return;
    const allIds = branchesList.map((b) => b._id);
    props.onChange(allIds);
  };

  const handleDeselectAll = () => {
    if (disabled) return;
    if (props.multi) {
      props.onChange([]);
    } else {
      props.onChange(null);
    }
  };

  const isAllSelected =
    branchesList.length > 0 &&
    branchesList.every((b) => selectedBranchIds.includes(b._id));

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 py-5 rounded-sm text-gray-800 border-slate-200 focus:border-red-500 focus:ring-red-500 h-10"
            disabled={disabled}
          />
        </div>
        {props.multi && (
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
              disabled={disabled || branchesList.length === 0}
              className="py-5 rounded-sm text-xs font-medium bg-red-500 hover:bg-red-600 text-white border-slate-200 "
            >
              {isAllSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>
        )}
      </div>

      {props.multi && selectedBranchIds.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {selectedBranchIds.map((id) => {
            const branch = branches.find((b) => b._id === id);
            if (!branch) return null;
            return (
              <Badge
                key={id}
                variant="secondary"
                className="bg-red-50 text-red-700 hover:bg-red-100 border-red-100 flex items-center gap-1.5 px-2.5 py-1"
              >
                <Building2 className="h-3 w-3" />
                {branch.branch_name}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => toggleBranch(id)}
                    className="ml-1 hover:text-red-900 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Branch List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-75 overflow-y-auto pr-1 custom-scrollbar">
        {branchesList.length === 0 ? (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
            <p className="text-slate-400 text-sm italic">
              {searchTerm
                ? "No branches match your search"
                : "No branches available"}
            </p>
          </div>
        ) : (
          branchesList.map((branch) => {
            const isSelected = selectedBranchIds.includes(branch._id);
            return (
              <button
                key={branch._id}
                type="button"
                disabled={disabled}
                onClick={() => toggleBranch(branch._id)}
                className={cn(
                  "flex items-start gap-3 p-3 text-left rounded-sm border-2 transition-all duration-200 group",
                  isSelected
                    ? "border-red-500 bg-red-50/30"
                    : "border-slate-300 hover:border-slate-300 bg-white shadow-sm hover:shadow-md",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 shrink-0",
                    isSelected ? "text-red-600" : "text-slate-400",
                  )}
                >
                  {props.multi ? (
                    isSelected ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )
                  ) : (
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                        isSelected ? "border-red-600" : "border-slate-300",
                      )}
                    >
                      {isSelected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-red-600" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm font-bold truncate",
                        isSelected ? "text-red-900" : "text-slate-700",
                      )}
                    >
                      {branch.branch_name}
                    </span>
                    {branch.is_main && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none h-5 px-1.5 text-[10px] uppercase tracking-wider font-bold">
                        Main
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-500 truncate">
                      {branch.branch_location}
                    </span>
                  </div>
                </div>

                {isSelected && !props.multi && (
                  <Check className="h-5 w-5 text-red-600 mt-0.5" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BranchSelector;
