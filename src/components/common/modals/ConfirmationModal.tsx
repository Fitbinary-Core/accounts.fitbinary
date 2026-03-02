"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LucideIcon } from "lucide-react";
import clsx from "clsx";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: "danger" | "warning" | "info";
    icon?: LucideIcon;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
    variant = "danger",
    icon: Icon,
}: ConfirmationModalProps) {
    const variantStyles = {
        danger: {
            bg: "bg-red-50",
            border: "border-red-100",
            icon: "text-red-600",
            button: "bg-red-600 hover:bg-red-700 shadow-red-200",
        },
        warning: {
            bg: "bg-amber-50",
            border: "border-amber-100",
            icon: "text-amber-600",
            button: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
        },
        info: {
            bg: "bg-blue-50",
            border: "border-blue-100",
            icon: "text-blue-600",
            button: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
        },
    };

    const currentVariant = variantStyles[variant];
    const DisplayIcon = Icon || AlertTriangle;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white border border-gray-100 p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl">
                {/* Icon Section */}
                <div className="flex items-center justify-center pt-10 pb-6">
                    <div
                        className={clsx(
                            "rounded-full p-5 border-2 transition-all duration-300",
                            currentVariant.bg,
                            currentVariant.border
                        )}
                    >
                        <DisplayIcon
                            className={clsx("h-10 w-10", currentVariant.icon)}
                            strokeWidth={2}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-8 pb-8 text-center">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-gray-500">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3 px-8 py-6 bg-gray-50/50 border-t border-gray-100">
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        variant="outline"
                        className="flex-1 py-5.5 cursor-pointer font-semibold text-gray-600 border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 transition-all rounded-sm"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={clsx(
                            "flex-1 py-5.5 cursor-pointer font-semibold text-white transition-all rounded-sm shadow-lg gap-2",
                            currentVariant.button,
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
