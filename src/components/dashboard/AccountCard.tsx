"use client";

import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    image?: string;
    linkText: string;
    className?: string;
}

export function AccountCard({
    title,
    description,
    icon: Icon,
    image,
    linkText,
    className
}: AccountCardProps) {
    return (
        <div className={cn(
            "bg-white border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer group",
            className
        )}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
                    <p className="text-gray-600 text-sm md:text-base pr-4 leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-50 text-brand-red">
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between group-hover:bg-gray-50 -mx-6 -mb-8 px-8 py-4 rounded-b-3xl transition-colors">
                <span className="text-sm font-medium text-brand-red">{linkText}</span>
                <ChevronRight className="w-4 h-4 text-brand-red" />
            </div>
        </div>
    );
}
