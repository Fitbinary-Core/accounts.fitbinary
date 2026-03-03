"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";


interface DashboardBreadcrumbProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
          {title}
        </h1>
        {description && <p className="text-zinc-500">{description}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
};

export default DashboardBreadcrumb;
