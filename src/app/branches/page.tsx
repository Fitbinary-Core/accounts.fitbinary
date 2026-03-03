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
import { formatDateTime } from "@/utils/utils";

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

  const branches = data?.data || [];

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
          title="Physical Nodes"
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
                The organizational registry is empty. Deploy your first branch to
                begin localized operations.
              </p>
              <Link href="/branches/create" className="mt-6">
                <Button className="h-10 px-6 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-all shadow-sm">
                  Create First Node
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <div
                  key={branch._id}
                  className="bg-white border border-zinc-200 rounded-sm overflow-hidden flex flex-col hover:border-zinc-400 transition-all transition-shadow shadow-none group"
                >
                  <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-sm bg-zinc-900 flex items-center justify-center text-white shadow-sm">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 tracking-tight truncate max-w-[150px]">
                          {branch.branch_name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {branch.is_main && (
                            <span className="text-[8px] bg-zinc-900 text-white px-1.5 py-0.5 rounded-sm font-black uppercase tracking-widest">
                              Main Node
                            </span>
                          )}
                          <span className="text-[8px] bg-zinc-100 text-zinc-500 border border-zinc-200 px-1.5 py-0.5 rounded-sm font-black uppercase tracking-widest">
                            {branch.branch_type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/branches/edit/${branch._id}`}>
                        <button className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-sm transition-all">
                          <Edit2 size={14} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(branch._id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <div className="flex items-start gap-2 text-zinc-500 mb-4">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-zinc-400"
                      />
                      <span className="text-[11px] font-medium leading-relaxed line-clamp-2">
                        {branch.branch_location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                          Registry ID
                        </span>
                        <code className="text-[10px] text-zinc-900 font-mono">
                          #{branch._id.slice(-6).toUpperCase()}
                        </code>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                          Provisioned
                        </span>
                        <span className="text-[10px] text-zinc-900 font-mono">
                          {new Date(branch.createdAt).toLocaleDateString()}
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
