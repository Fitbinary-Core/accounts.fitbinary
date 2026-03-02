"use client";

import { useEffect, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/utils";

export interface TabOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface SearchFilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch: (query: string) => void;

  filters?: Record<string, string>;
  onFilter: (key: string, value: string) => void;

  sortValue?: string;
  onSort: (value: string) => void;

  filterConfigs?: FilterConfig[];
  sortOptions?: FilterOption[];
  onReset: () => void;
  placeholder?: string;

  initialSearch?: string;
  initialFilters?: Record<string, string>;
  initialSort?: string;

  tabs?: TabOption[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const SearchFilter = ({
  searchValue: controlledSearchValue,
  onSearchChange,
  onSearch,
  filters = {},
  onFilter,
  sortValue = "",
  onSort,
  filterConfigs = [],
  sortOptions = [],
  onReset,
  placeholder = "Search...",
  initialSearch = "",
  tabs = [],
  activeTab,
  onTabChange,
}: SearchFilterProps) => {
  const [internalSearchValue, setInternalSearchValue] = useState(
    controlledSearchValue ?? initialSearch,
  );

  useEffect(() => {
    if (controlledSearchValue !== undefined) {
      setInternalSearchValue(controlledSearchValue);
    }
  }, [controlledSearchValue]);

  const debouncedSearch = useDebounce(internalSearchValue, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleSearchChange = (value: string) => {
    setInternalSearchValue(value);
    onSearchChange?.(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all") {
      onFilter(key, "");
    } else {
      onFilter(key, value);
    }
  };

  const handleReset = () => {
    setInternalSearchValue("");
    onReset();
  };

  const activeFiltersCount = Object.keys(filters).length + (sortValue ? 1 : 0);

  return (
    <div className="flex flex-col gap-4 py-4 bg-white p-4 rounded-sm border border-gray-200">
      {/* Tabs */}
      {tabs && tabs.length > 0 && onTabChange && (
        <div className="flex space-x-6 border-b border-gray-200 overflow-x-auto scrollbar-hide pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`pb-2 -mb-px text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.value
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`ml-2 inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    activeTab === tab.value
                      ? "bg-red-500 text-white"
                      : "bg-gray-500 text-gray-100"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-9 bg-gray-50 border-gray-200 text-gray-800 focus:bg-white transition-colors"
            value={internalSearchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          {/* Dynamic Filters */}
          {filterConfigs.map((config) => (
            <Select
              key={config.key}
              value={filters[config.key] || "all"}
              onValueChange={(value: string) =>
                handleFilterChange(config.key, value)
              }
            >
              <SelectTrigger className="w-35 bg-white text-gray-800 border-gray-200">
                <SelectValue placeholder={config.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {config.label}</SelectItem>
                {config.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* Sort Dropdown */}
          {sortOptions.length > 0 && (
            <Select value={sortValue} onValueChange={onSort}>
              <SelectTrigger className="w-40 bg-white text-gray-800 border-gray-200">
                <span className="text-gray-500 mr-2">Sort by:</span>
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Reset Button */}
          {(internalSearchValue || activeFiltersCount > 0) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              title="Reset Filters"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
