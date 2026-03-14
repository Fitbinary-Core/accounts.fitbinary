"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBranches, deleteBranch } from "@/services/branch/branch.service";
import { Plus, MapPin, Trash2, Edit2, Loader2, Building2 } from "lucide-react";
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
  const [limit, setLimit] = useState(9);

  const { data, isLoading, error } = useQuery({
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setBranchToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (branchToDelete) {
      deleteMutation.mutate(branchToDelete);
    }
  };

  const branches = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-900" />
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
            Hydrating Branch Data...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title="Physical Branches"
          description="Manage organizational branches and localized business centers."
          actions={
            <Link href="/branches/create">
              <Button className="h-10 px-4 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-all flex items-center gap-2 shadow-sm active:scale-95">
                <Plus size={16} />
                <span>Initialize New Branch</span>
              </Button>
            </Link>
          }
        />

        <div className="w-full">
          {branches.length === 0 ? (
            <div className="py-24 border border-dashed border-zinc-200 rounded-sm bg-zinc-50/50 flex flex-col items-center justify-center text-center px-4">
              <div className="size-16 rounded-sm bg-white border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
                <Building2 className="text-zinc-300" size={32} />
              </div>
              <h2 className="text-lg font-bold text-zinc-900">
                No Active Branches
              </h2>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs font-medium leading-relaxed">
                The organizational registry is empty. Deploy your first branch
                to begin localized operations.
              </p>
              <Link href="/branches/create" className="mt-6">
                <Button className="h-10 px-6 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-all shadow-sm">
                  Create First Branch
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches?.map((branch) => (
                <div
                  key={branch._id}
                  className="bg-white border border-zinc-200 rounded-sm overflow-hidden flex flex-col hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-md group relative"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                    <Link href={`/branches/edit/${branch._id}`}>
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-sm shadow-sm transition-all hover:scale-105">
                        <Edit2 size={14} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(branch._id)}
                      className="p-1.5 bg-white/90 backdrop-blur-sm text-zinc-400 hover:text-red-600 border border-zinc-200 rounded-sm shadow-sm transition-all hover:scale-105"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="p-5 border-b border-zinc-100 bg-zinc-50/10">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="size-12 rounded-sm bg-zinc-900 flex items-center justify-center text-white shadow-lg overflow-hidden border border-zinc-800">
                          {branch.branch_organization &&
                          typeof branch.branch_organization !== "string" &&
                          branch.branch_organization.business_logo ? (
                            <img
                              src={branch.branch_organization.business_logo}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <Building2 size={24} className="opacity-80" />
                          )}
                        </div>
                        {branch.is_main && (
                          <div className="absolute -bottom-1 -right-1 size-4 bg-zinc-900 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-[6px] text-white font-black uppercase">
                              M
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <h3 className="text-sm font-bold text-zinc-900 tracking-tight truncate">
                          {branch.branch_name}
                        </h3>

                        {branch.branch_organization &&
                          typeof branch.branch_organization !== "string" && (
                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider truncate mt-0.5">
                              {branch.branch_organization.business_name}
                            </p>
                          )}

                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[8px] bg-zinc-100 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded-sm font-black uppercase tracking-widest">
                            {branch.branch_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="flex items-start gap-3 group/loc">
                      <div className="mt-1 size-5 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 group-hover/loc:bg-zinc-900 group-hover/loc:text-white transition-colors">
                        <MapPin size={10} />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-500 leading-relaxed line-clamp-2">
                        {branch.branch_location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-zinc-100/50">
                      <div className="space-y-1">
                        <span className="text-[8px] text-zinc-400 font-black uppercase tracking-[0.2em] block">
                          Registry
                        </span>
                        <code className="text-[10px] text-zinc-900 font-mono font-bold bg-zinc-50 px-1.5 py-0.5 rounded-sm border border-zinc-100">
                          #{branch._id.slice(-6).toUpperCase()}
                        </code>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[8px] text-zinc-400 font-black uppercase tracking-[0.2em] block">
                          Provisioned
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono font-medium">
                          {new Date(branch.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex justify-center py-10">
              <Pagination
                page={data.meta.page}
                total={data.meta.totalPages}
                onChange={(newPage: number) => setPage(newPage)}
              />
            </div>
          )}
        </div>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Decommission Branch"
          description="Are you sure you want to decommission this physical node? This action is irreversible and will purge all localized data associated with this branch."
          confirmText="Confirm Deletion"
          cancelText="Abort Operation"
          isLoading={deleteMutation.isPending}
          variant="danger"
          icon={Trash2}
        />
      </div>
    </DashboardLayout>
  );
}
