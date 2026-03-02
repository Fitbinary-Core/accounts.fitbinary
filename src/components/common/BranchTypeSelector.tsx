"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANCH_TYPES } from "@/schemas/branch";
import { Building2 } from "lucide-react";

interface BranchTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const BranchTypeSelector = ({
  value,
  onChange,
  disabled,
}: BranchTypeSelectorProps) => {
  return (
    <div className="relative">
      <Building2
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
        size={18}
      />
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="pl-10 py-5.5 rounded-sm border-gray-200 focus:ring-red-500 focus:border-red-500 w-full text-gray-800 bg-white">
          <SelectValue placeholder="Select branch type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {BRANCH_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchTypeSelector;
