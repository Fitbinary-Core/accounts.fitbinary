"use client";

import React, { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Search,
  MapPin,
  Building2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Branch {
  _id: string;
  branch_name: string;
  branch_location: string;
}

interface BranchSelectorProps {
  branches: Branch[];
  value: string | string[];
  onChange: (value: any) => void;
  multi?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function BranchSelector({
  branches = [],
  value,
  onChange,
  multi = false,
  disabled = false,
  placeholder = "Select branch...",
}: BranchSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (branchId: string) => {
    if (multi) {
      const newValue = selectedValues.includes(branchId)
        ? selectedValues.filter((id) => id !== branchId)
        : [...selectedValues, branchId];
      onChange(newValue);
    } else {
      onChange(branchId);
      setOpen(false);
    }
  };

  const removeItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selectedValues.filter((val) => val !== id));
  };

  return (
    <div className="w-full space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-12 px-3 py-2 border-gray-300 hover:border-red-500 hover:bg-white text-gray-900 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-red-500/20",
              disabled && "opacity-50 cursor-not-allowed",
              selectedValues.length > 0 && "border-red-200 bg-red-50/10",
            )}
            disabled={disabled}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap gap-1.5 items-center overflow-hidden">
              <Building2 className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
              {selectedValues.length > 0 ? (
                multi ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedValues.map((id) => {
                      const branch = branches.find((b) => b._id === id);
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="bg-white border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-1 py-0.5 pl-2 pr-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                        >
                          {branch?.branch_name || id}
                          <X
                            size={12}
                            className="cursor-pointer hover:text-red-900"
                            onClick={(e) => removeItem(e, id)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-sm font-medium">
                    {branches.find((b) => b._id === selectedValues[0])
                      ?.branch_name || selectedValues[0]}
                  </span>
                )
              ) : (
                <span className="text-gray-400 text-sm">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 bg-white border-gray-200 shadow-2xl rounded-xl overflow-hidden"
          align="start"
        >
          <Command className="border-none">
            <div className="flex items-center border-b border-gray-100 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
              <CommandInput
                placeholder="Search branches..."
                className="h-11 bg-transparent focus:ring-0 border-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <CommandList className="max-h-75 overflow-y-auto custom-scrollbar">
              <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                No branch found.
              </CommandEmpty>
              <CommandGroup className="p-1.5">
                {branches.map((branch) => {
                  const isSelected = selectedValues.includes(branch._id);
                  return (
                    <CommandItem
                      key={branch._id}
                      value={branch.branch_name}
                      onSelect={() => handleSelect(branch._id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors mb-1",
                        isSelected
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-400",
                          )}
                        >
                          <MapPin size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold leading-none">
                            {branch.branch_name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium mt-1 leading-none uppercase tracking-wider">
                            {branch.branch_location}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="bg-red-500 text-white rounded-full p-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
