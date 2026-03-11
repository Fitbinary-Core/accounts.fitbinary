"use client";

import { useState, useMemo } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  flag?: string;
  symbol?: string;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
};

export type CustomSelectorProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  emptyMessage?: string;
};

const CustomSelector = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  error,
  label,
  required = false,
  emptyMessage = "No options found",
}: CustomSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;

    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="default"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between py-7 min-h-12 px-4 border border-gray-400 hover:bg-gray-50 transition-all",
              error && "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed",
              !selectedOption && "text-gray-500",
            )}
          >
            {selectedOption ? (
              <div className="flex items-center gap-3 flex-1 text-left">
                {selectedOption.flag && (
                  <span className="text-2xl shrink-0">
                    {selectedOption.flag}
                  </span>
                )}
                {selectedOption.icon && (
                  <span className="shrink-0">{selectedOption.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {selectedOption.label}
                    {selectedOption.symbol && (
                      <span className="text-gray-600 font-normal">
                        ({selectedOption.symbol})
                      </span>
                    )}
                  </div>
                  {selectedOption.description && (
                    <div className="text-xs text-gray-600 truncate mt-0.5">
                      {selectedOption.description}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200",
                open && "transform rotate-180",
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 shadow-xl border-gray-200 bg-white"
          align="start"
          sideOffset={4}
        >
          <div className="flex flex-col max-h-100 bg-white">
            {/* Search Header */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 pl-9 pr-9 border-gray-300 focus-visible:ring-red-500 bg-white text-gray-900"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto flex-1 p-2 bg-white">
              {filteredOptions.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-600">
                  {emptyMessage}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredOptions.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 bg-white",
                          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1",
                          isSelected &&
                            "bg-red-50 hover:bg-red-100 border border-red-200",
                        )}
                      >
                        {/* Flag or Icon */}
                        {option.flag && (
                          <span className="text-2xl shrink-0">
                            {option.flag}
                          </span>
                        )}
                        {option.icon && (
                          <span className="shrink-0">{option.icon}</span>
                        )}

                        {/* Label and Description */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              "font-semibold text-sm flex items-center gap-2",
                              isSelected ? "text-gray-900" : "text-gray-800",
                            )}
                          >
                            {option.label}
                            {option.symbol && (
                              <span className="text-gray-600 font-normal text-xs">
                                {option.symbol}
                              </span>
                            )}
                          </div>
                          {option.description && (
                            <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                              {option.description}
                            </div>
                          )}
                        </div>

                        {/* Check Icon */}
                        {isSelected && (
                          <Check className="h-4 w-4 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <span className="text-xs">⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelector;
