"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBranches, deleteBranch } from "@/services/branch/branch.service";
import {
  Plus,
  MapPin,
  Trash2,
  Edit2,
  Loader2,
  Building2,
  Star,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { ConfirmationModal } from "@/components/common/modals/ConfirmationModal";
import { useState } from "react";
import Pagination from "@/components/common/Pagination";
import { DashboardLayout } from "@/components/dashboard/Layout";

export default function BranchesListingPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-branches", page, limit],
    queryFn: () => getMyBranches(page, limit),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBranch(id),
    onSuccess: (res) => {
      toast.success(res.message || "Branch deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-branches"] });
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete branch");
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
    },
  });

  const handleDelete = (id: string) => {
    setBranchToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (branchToDelete) deleteMutation.mutate(branchToDelete);
  };

  const branches = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading branches...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DashboardBreadcrumb
          title="Branches"
          description="Manage your organization's physical locations and offices."
          actions={
            <Link href="/branches/create">
              <Button className="h-9 px-4 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-black transition-all flex items-center gap-2 shadow-sm">
                <Plus size={15} />
                Add Branch
              </Button>
            </Link>
          }
        />

        {branches.length === 0 ? (
          <div className="py-24 border border-dashed border-zinc-200 rounded-lg bg-zinc-50 flex flex-col items-center justify-center text-center px-4">
            <div className="size-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
              <GitBranch className="text-zinc-400" size={24} />
            </div>
            <h2 className="text-base font-semibold text-zinc-900">No branches yet</h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-xs leading-relaxed">
              Add your first branch to start managing multiple locations.
            </p>
            <Link href="/branches/create" className="mt-5">
              <Button className="h-9 px-5 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-black transition-all shadow-sm">
                Add First Branch
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch) => (
                <div
                  key={branch._id}
                  className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col hover:border-zinc-300 hover:shadow-md transition-all duration-200 group"
                >
                  {/* Card Header */}
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {branch.branch_organization &&
                          typeof branch.branch_organization !== "string" &&
                          branch.branch_organization.business_logo ? (
                          <img
                            src={branch.branch_organization.business_logo}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <Building2 size={18} className="text-zinc-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-zinc-900 truncate">
                            {branch.branch_name}
                          </h3>
                          {branch.is_main && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded text-xs font-medium text-amber-700 shrink-0">
                              <Star size={9} className="fill-amber-500 text-amber-500" />
                              Main
                            </span>
                          )}
                        </div>
                        {branch.branch_organization &&
                          typeof branch.branch_organization !== "string" && (
                            <p className="text-xs text-zinc-500 truncate mt-0.5">
                              {branch.branch_organization.business_name}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/branches/edit/${branch._id}`}>
                        <button className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(branch._id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-100 mx-4" />

                  {/* Card Body */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500 min-w-0">
                      <MapPin size={13} className="shrink-0 text-zinc-400" />
                      <span className="text-xs truncate">{branch.branch_location}</span>
                    </div>
                    <span
                      className={`ml-3 shrink-0 px-2 py-0.5 rounded text-xs font-medium border ${branch.branch_type === "Head Office"
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200"
                        }`}
                    >
                      {branch.branch_type}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="px-4 pb-4">
                    <p className="text-xs text-zinc-500">
                      Added {new Date(branch.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {data?.meta && data.meta.totalPages > 1 && (
              <div className="flex justify-center py-6">
                <Pagination
                  page={data.meta.page}
                  total={data.meta.totalPages}
                  onChange={(newPage: number) => setPage(newPage)}
                />
              </div>
            )}
          </>
        )}

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Branch"
          description="Are you sure you want to delete this branch? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteMutation.isPending}
          variant="danger"
          icon={Trash2}
        />
      </div>
    </DashboardLayout>
  );
}
