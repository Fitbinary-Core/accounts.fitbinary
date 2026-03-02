"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
}

interface DashboardBreadcrumbProps {
  title: string;
  description?: string;
  items?: BreadcrumbItem[];
  actions?: React.ReactNode;
  icon?: React.ElementType;
}

const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({
  title,
  description,
  items = [],
  actions,
  icon: PageIcon,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 relative">
      <div className="w-full mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              {/* Breadcrumb Path */}
              <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
                <p className="text-red-600 transition-colors flex items-center gap-1 group">
                  <Home size={12} />
                  Dashboard
                </p>

                {items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight size={12} className="text-slate-400" />
                    <span className="text-red-600 font-semibold">
                      {item.label}
                    </span>
                  </React.Fragment>
                ))}
              </nav>

              {/* Title & Description */}
              <div className="flex items-center space-x-3">
                {/* Page Icon */}
                {PageIcon && (
                  <div className="flex items-center justify-center bg-red-500 p-3 rounded border border-red-100 text-white shrink-0">
                    <PageIcon size={24} strokeWidth={2} />
                  </div>
                )}

                <div className="flex flex-col overflow-hidden">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-xs text-slate-600 font-medium mt-1 truncate max-w-md">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardBreadcrumb;
