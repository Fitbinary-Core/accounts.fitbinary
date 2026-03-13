"use client";

import React, { useState, useMemo } from "react";
import { Check, Search, X, Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface Organization {
  _id: string;
  business_name: string;
  business_email: string;
  location?: string;
  business_logo?: string;
  business_phone?: string;
  business_type?: string;
  business_size?: string;
  country?: string;
  state?: string;
  district?: string;
  municipality?: string;
}

type OrganizationSelectorProps = {
  organizations: Organization[];
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

const OrganizationSelector: React.FC<OrganizationSelectorProps> = (props) => {
  const {
    organizations = [],
    disabled = false,
    placeholder = "Search organizations...",
  } = props;

  const [searchTerm, setSearchTerm] = useState("");

  const organizationsList = useMemo(() => {
    const list = Array.isArray(organizations) ? organizations : [];
    if (!searchTerm) return list;
    return list.filter(
      (o) =>
        o.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.business_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.location &&
          o.location.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [organizations, searchTerm]);

  const selectedOrganizationIds = useMemo(() => {
    if (props.multi) {
      return Array.isArray(props.value) ? props.value : [];
    }
    return props.value ? [props.value] : [];
  }, [props.value, props.multi]);

  const toggleOrganization = (organizationId: string) => {
    if (disabled) return;

    if (props.multi) {
      const currentValues = Array.isArray(props.value) ? props.value : [];
      const isSelected = currentValues.includes(organizationId);
      if (isSelected) {
        props.onChange(currentValues.filter((id) => id !== organizationId));
      } else {
        props.onChange([...currentValues, organizationId]);
      }
    } else {
      const isSelected = props.value === organizationId;
      props.onChange(isSelected ? null : organizationId);
    }
  };

  const handleSelectAll = () => {
    if (disabled || !props.multi) return;
    const allIds = organizationsList.map((o) => o._id);
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
    organizationsList.length > 0 &&
    organizationsList.every((o) => selectedOrganizationIds.includes(o._id));

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
              disabled={disabled || organizationsList.length === 0}
              className="py-5 rounded-sm text-xs font-medium bg-red-500 hover:bg-red-600 text-white border-slate-200 "
            >
              {isAllSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>
        )}
      </div>

      {props.multi && selectedOrganizationIds.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {selectedOrganizationIds.map((id) => {
            const organization = organizations.find((o) => o._id === id);
            if (!organization) return null;
            return (
              <Badge
                key={id}
                variant="secondary"
                className="bg-red-50 text-red-700 hover:bg-red-100 border-red-100 flex items-center gap-1.5 px-2.5 py-1"
              >
                <Building2 className="h-3 w-3" />
                {organization.business_name}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => toggleOrganization(id)}
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

      {/* Organization List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-75 overflow-y-auto pr-1 custom-scrollbar">
        {organizationsList.length === 0 ? (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
            <p className="text-slate-400 text-sm italic">
              {searchTerm
                ? "No organizations match your search"
                : "No organizations available"}
            </p>
          </div>
        ) : (
          organizationsList.map((organization) => {
            const isSelected = selectedOrganizationIds.includes(
              organization._id,
            );
            return (
              <button
                key={organization._id}
                type="button"
                disabled={disabled}
                onClick={() => toggleOrganization(organization._id)}
                className={cn(
                  "flex items-start gap-4 p-4 text-left rounded-sm border-2 transition-all duration-200 group relative overflow-hidden",
                  isSelected
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200 hover:border-slate-300 bg-white shadow-sm hover:shadow-md",
                )}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10 transition-transform" />
                )}

                {/* Logo or Icon */}
                <div className="shrink-0 mt-0.5">
                  {organization.business_logo ? (
                    <img
                      src={organization.business_logo}
                      alt={organization.business_name}
                      className={cn(
                        "h-10 w-10 rounded-sm object-cover border-2 shadow-sm transition-all",
                        isSelected ? "border-red-500" : "border-slate-100",
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "h-10 w-10 rounded-sm border-2 flex items-center justify-center shadow-sm transition-all",
                        isSelected
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-slate-100 bg-slate-50 text-slate-400",
                      )}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3
                        className={cn(
                          "text-[13px] font-black truncate leading-tight tracking-tight",
                          isSelected ? "text-red-950" : "text-slate-900",
                        )}
                      >
                        {organization.business_name}
                      </h3>
                      {organization.business_type && (
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                          {organization.business_type.replace(/_/g, " ")}
                        </p>
                      )}
                    </div>

                    {/* Size Badge */}
                    {organization.business_size && (
                      <Badge className="shrink-0 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none h-5 px-1.5 text-[9px] uppercase tracking-wider font-bold">
                        {organization.business_size}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1.5 mt-2">
                    {organization.business_email && (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-[8px]">@</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-600 truncate">
                          {organization.business_email}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="h-2.25 w-2.25 text-slate-500" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 truncate">
                        {[
                          organization.location,
                          organization.municipality,
                          organization.district,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Location not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selection Checkmark */}
                <div className="shrink-0 flex items-center h-full pl-2">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected
                        ? "border-red-600 bg-red-600"
                        : "border-slate-300",
                    )}
                  >
                    <Check
                      className={cn(
                        "h-3 w-3",
                        isSelected ? "text-white" : "text-transparent",
                      )}
                      strokeWidth={3}
                    />
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrganizationSelector;
