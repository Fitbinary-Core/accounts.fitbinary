"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    User,
    ShieldCheck,
    CreditCard,
    Users,
    LayoutDashboard,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Personal info", icon: User, href: "/personal-info" },
    { name: "Security", icon: ShieldCheck, href: "/security" },
    { name: "Payments & subscriptions", icon: CreditCard, href: "/payments" },
    { name: "App management", icon: LayoutDashboard, href: "/apps" },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none pt-2 flex flex-col h-full",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex items-center justify-between px-6 mb-6 lg:hidden">
                    <span className="text-xl font-bold text-brand-red">Fitbinary</span>
                    <button onClick={() => setIsOpen(false)} className="p-2">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <nav className="px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full transition-colors",
                                    isActive
                                        ? "bg-red-50 text-brand-red"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-brand-red" : "text-gray-500")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
