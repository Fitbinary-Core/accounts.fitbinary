"use client";

import React from "react";
import {
    Search,
    HelpCircle,
    Grid,
    Menu,
    Bell
} from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";

interface HeaderProps {
    toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-brand-red">Fitbinary</span>
                    <span className="text-lg text-gray-500 hidden sm:inline">Account</span>
                </div>
            </div>

            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border-none bg-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-red outline-none transition-all placeholder:text-gray-500"
                        placeholder="Search help, settings, and more"
                    />
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hidden sm:block">
                    <HelpCircle className="w-6 h-6" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hidden sm:block">
                    <Bell className="w-6 h-6" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <Grid className="w-6 h-6" />
                </button>
                <ProfileDropdown />
            </div>
        </header>
    );
}
