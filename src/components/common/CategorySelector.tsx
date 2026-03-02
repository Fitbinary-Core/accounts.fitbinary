"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import categoriesSelectorService from "@/services/categories/categories.selector.service";
import type { Category } from "@/schemas/categories";
import {
    ChevronDown,
    ChevronRight,
    Folder,
    FolderOpen,
    Leaf,
    Search,
    X,
    Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getTenantSelectedCategories } from "@/services/categories/categories.service";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderTree, Plus } from "lucide-react";

type CategoryNodeProps = {
    node: Category;
    depth: number;
    onlyTopLevelSelectable: boolean;
    isOnlyFinalLevelSelectable: boolean;
    isMidLevelSelectable: boolean;
    onSelect: (node: Category) => void;
    selectedCategories: Category[];
};

export type CategorySelectorProps = {
    isMulti?: boolean;
    selectedCategories: Category[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    selectedIds?: string[];
    setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
    isOnlyFinalSelectable?: boolean;
    onlyTopLevelSelectable?: boolean;
    isMidLevelSelectable?: boolean;
    onlyOneSelectable?: boolean;
    onlyOrganization?: boolean;
    className?: string;
    hideHeader?: boolean;
    hideSelectedBottom?: boolean;
    asDialog?: boolean;
    triggerText?: string;
    dialogTitle?: string;
    headerMessage?: string;
    onClose?: () => void;
};

const CategoryNode = ({
    node,
    depth,
    onlyTopLevelSelectable,
    isOnlyFinalLevelSelectable,
    isMidLevelSelectable,
    onSelect,
    selectedCategories,
}: CategoryNodeProps) => {
    const [expanded, setExpanded] = useState(false);

    const { data: childrenCategories, isLoading } = useQuery({
        queryKey: ["children-categories", node._id],
        queryFn: () => categoriesSelectorService.getCategoryChildren(node._id),
        enabled: expanded && !onlyTopLevelSelectable,
    });

    const isSelected = selectedCategories.some((cat) => cat._id === node._id);
    const hasChildren = node.is_final_level === false;

    const isSelectable = () => {
        if (onlyTopLevelSelectable && !node.parent) return true;
        if (isOnlyFinalLevelSelectable && node.is_final_level) return true;
        if (isMidLevelSelectable && !node.is_final_level) return true;

        if (
            !onlyTopLevelSelectable &&
            !isOnlyFinalLevelSelectable &&
            !isMidLevelSelectable
        ) {
            return true;
        }

        return false;
    };

    const handleNodeClick = () => {
        if (isSelectable()) {
            onSelect(node);
        } else if (hasChildren && !onlyTopLevelSelectable) {
            setExpanded(!expanded);
        }
    };

    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasChildren && !onlyTopLevelSelectable) {
            setExpanded(!expanded);
        }
    };

    const indent = depth * 24;

    return (
        <li className="relative list-none" style={{ paddingLeft: indent }}>
            {depth > 0 && (
                <span
                    className="absolute top-0 bottom-0 w-px bg-gray-300"
                    style={{ left: indent - 14 }}
                    aria-hidden
                />
            )}

            <div
                onClick={handleNodeClick}
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                aria-label={`${node.name}${isSelected ? ", selected" : ""}`}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNodeClick();
                    }
                }}
                className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-left transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50",
                    isSelected
                        ? "border-red-500 bg-red-50 text-gray-900"
                        : "border-transparent text-gray-900 hover:bg-gray-100",
                    !isSelectable() && hasChildren && "opacity-60",
                )}
            >
                {!onlyTopLevelSelectable && (
                    <button
                        type="button"
                        className="flex size-6 shrink-0 items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        onClick={handleExpandClick}
                        aria-label={expanded ? "Collapse" : "Expand"}
                        tabIndex={-1}
                    >
                        {hasChildren ? (
                            expanded ? (
                                <ChevronDown className="size-4" />
                            ) : (
                                <ChevronRight className="size-4" />
                            )
                        ) : (
                            <span className="size-4" />
                        )}
                    </button>
                )}

                <span className="flex shrink-0">
                    {hasChildren ? (
                        expanded && (childrenCategories?.length ?? 0) > 0 ? (
                            <FolderOpen className="size-4 text-red-600" />
                        ) : (
                            <Folder className="size-4 text-gray-500" />
                        )
                    ) : (
                        <Leaf className="size-4 text-red-500" />
                    )}
                </span>

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                    {node.name}
                </span>

                {isLoading && (
                    <span className="shrink-0 text-xs text-gray-500">Loading…</span>
                )}

                {isSelectable() && (
                    <div
                        className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors pointer-events-none",
                            isSelected
                                ? "border-red-600 bg-red-600 text-white"
                                : "border-gray-400 bg-white",
                        )}
                        aria-hidden
                    >
                        {isSelected && <Check className="size-3 stroke-[2.5]" />}
                    </div>
                )}
            </div>

            {expanded && !onlyTopLevelSelectable && (
                <ul className="mt-1 space-y-1">
                    {childrenCategories?.map((child) => (
                        <CategoryNode
                            key={child._id}
                            node={child}
                            depth={depth + 1}
                            onlyTopLevelSelectable={onlyTopLevelSelectable}
                            isOnlyFinalLevelSelectable={isOnlyFinalLevelSelectable}
                            isMidLevelSelectable={isMidLevelSelectable}
                            onSelect={onSelect}
                            selectedCategories={selectedCategories}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

const CategorySelector = ({
    isMulti = false,
    selectedCategories,
    setSelectedCategories,
    selectedIds,
    setSelectedIds,
    isOnlyFinalSelectable = false,
    onlyTopLevelSelectable = false,
    isMidLevelSelectable = false,
    onlyOneSelectable = false,
    onlyOrganization = false,
    className,
    hideHeader = false,
    hideSelectedBottom = false,
    asDialog = true,
    triggerText = "Select Category",
    dialogTitle = "Select Categories",
    headerMessage,
    onClose,
}: CategorySelectorProps) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [backupCategories, setBackupCategories] = useState<Category[]>([]);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearchQuery(searchQuery), 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const { data: roots, isLoading } = useQuery({
        queryKey: ["categories", debouncedSearchQuery],
        queryFn: () =>
            categoriesSelectorService.getAllCategories({
                queries: { debouncedSearchQuery },
            }),
    });

    const { data: org_categories } = useQuery({
        queryKey: ["organization-categories", debouncedSearchQuery],
        queryFn: () => getTenantSelectedCategories(),
    });

    const handleSelect = (node: Category) => {
        const isNodeSelectable = () => {
            if (onlyTopLevelSelectable && !node.parent) return true;
            if (isOnlyFinalSelectable && node.is_final_level) return true;
            if (isMidLevelSelectable && !node.is_final_level) return true;

            if (
                !onlyTopLevelSelectable &&
                !isOnlyFinalSelectable &&
                !isMidLevelSelectable
            ) {
                return true;
            }

            return false;
        };

        if (!isNodeSelectable()) return;

        if (onlyOneSelectable || !isMulti) {
            setSelectedCategories([node]);
            setSelectedIds?.([node._id]);
            if (asDialog) setOpen(false);
            return;
        }

        const isAlreadySelected = selectedCategories.some(
            (c) => c._id === node._id,
        );
        const nextCategories = isAlreadySelected
            ? selectedCategories.filter((c) => c._id !== node._id)
            : [...selectedCategories, node];

        setSelectedCategories(nextCategories);
        setSelectedIds?.(nextCategories.map((c) => c._id));
    };

    const SelectorContent = (
        <div
            className={cn(
                "flex flex-col bg-white overflow-hidden",
                asDialog
                    ? "rounded-none"
                    : "rounded-none border border-gray-200 shadow-sm",
                !asDialog && className,
            )}
        >
            {/* Header */}
            <div className="px-4 p-2 border-b border-gray-100 bg-gray-50/50">
                <div className="mb-2">
                    {headerMessage && (
                        <p className="text-xs text-gray-500 mt-1">{headerMessage}</p>
                    )}
                </div>

                {!onlyTopLevelSelectable && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories…"
                            aria-label="Search categories"
                            className="h-10 rounded-lg border-gray-300 bg-white pl-9 pr-9 text-gray-900 placeholder:text-gray-500 focus-visible:ring-red-500 w-full"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="max-h-80 overflow-y-auto p-4 bg-white min-h-50">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12 text-gray-600">
                        Loading categories…
                    </div>
                ) : (onlyOrganization ? org_categories : roots) &&
                    (onlyOrganization
                        ? (org_categories?.length ?? 0)
                        : (roots?.length ?? 0)) > 0 ? (
                    <ul className="space-y-1">
                        {(onlyOrganization ? org_categories : roots)?.map((node) => (
                            <CategoryNode
                                key={node._id}
                                node={node}
                                depth={0}
                                onlyTopLevelSelectable={onlyTopLevelSelectable}
                                isOnlyFinalLevelSelectable={isOnlyFinalSelectable}
                                isMidLevelSelectable={isMidLevelSelectable}
                                onSelect={handleSelect}
                                selectedCategories={selectedCategories}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="py-12 text-center text-sm text-gray-600">
                        No categories found.
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 space-y-4">
                {selectedCategories.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Selected Items ({selectedCategories.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedCategories.map((category) => (
                                <span
                                    key={category._id}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                    {category.name}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = selectedCategories.filter(
                                                (c) => c._id !== category._id,
                                            );
                                            setSelectedCategories(next);
                                            setSelectedIds?.(next.map((c) => c._id));
                                        }}
                                        aria-label={`Remove ${category.name}`}
                                        className="rounded p-0.5 text-red-600 hover:bg-red-50"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setSelectedCategories(backupCategories);
                            setSelectedIds?.(backupCategories.map((c) => c._id));
                            onClose?.();
                        }}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-bold px-6"
                    >
                        <X className="size-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-lg shadow-red-200 rounded-sm"
                    >
                        <Check className="size-4 mr-2" />
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );

    if (!asDialog) {
        return SelectorContent;
    }

    return (
        <div className={cn("space-y-3", className)}>
            <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                    if (isOpen) {
                        // Backup current state when opening
                        setBackupCategories([...selectedCategories]);
                    }
                    setOpen(isOpen);
                }}
            >
                <DialogTrigger asChild>
                    <Button type="button" className="text-white py-5.5 rounded-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FolderTree className="size-4 group-hover:text-red-600 transition-colors" />
                            <span className="font-medium group-hover:text-gray-900">
                                {triggerText}
                            </span>
                        </div>
                        <Plus className="size-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-150 p-0 overflow-hidden border-none bg-transparent shadow-none">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-red-600 rounded-full" />
                                {dialogTitle}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-0">
                            <CategorySelector
                                {...({
                                    isMulti,
                                    selectedCategories,
                                    setSelectedCategories,
                                    selectedIds,
                                    setSelectedIds,
                                    isOnlyFinalSelectable,
                                    onlyTopLevelSelectable,
                                    isMidLevelSelectable,
                                    onlyOneSelectable,
                                    onlyOrganization,
                                    asDialog: false,
                                    hideHeader: false,
                                    hideSelectedBottom: false,
                                } as any)}
                                dialogTitle={dialogTitle}
                                headerMessage={headerMessage}
                                onClose={() => setOpen(false)}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Selected Items */}
            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {selectedCategories.map((category) => (
                        <div
                            key={category._id}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50/50 px-3 py-1.5 text-sm font-medium text-gray-900 animate-in fade-in zoom-in duration-200"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {category.name}
                            <button
                                type="button"
                                onClick={() => {
                                    const next = selectedCategories.filter(
                                        (c) => c._id !== category._id,
                                    );
                                    setSelectedCategories(next);
                                    setSelectedIds?.(next.map((c) => c._id));
                                }}
                                className="rounded-md p-0.5 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                            >
                                <X className="size-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySelector;
