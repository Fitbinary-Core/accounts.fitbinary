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

  const branches = data?.data || [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-50/30 min-h-full">
        <DashboardBreadcrumb
          title="Branches"
          description="Manage your business branches across different locations."
          items={[{ label: "Branches" }]}
          icon={Building2}
          actions={
            <Link href="/branches/add">
              <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-5 py-5.5 rounded-sm cursor-pointer transition-all shadow-md shadow-red-200 border-none">
                <Plus size={18} />
                <span>Add New Branch</span>
              </Button>
            </Link>
          }
        />

        <div className="p-4 w-full mx-auto">
          {branches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="text-red-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                No Branches Found
              </h2>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                You haven&apos;t added any branches yet. Start by adding your
                first branch to manage your locations.
              </p>
              <Link href="/branches/add" className="mt-6 inline-block">
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Create First Branch
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch) => (
                <div
                  key={branch._id}
                  className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 p-3 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Building2 size={24} />
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/branches/edit/${branch._id}`}>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(branch._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {branch.branch_name}
                  </h3>

                  <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-red-500" />
                    <span>{branch.branch_location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex flex-col gap-1">
                      {branch.is_main ? (
                        <span className="bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit">
                          Main Branch
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-800 font-medium">
                          Regular Branch
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit">
                        {branch.branch_type}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-800">
                      Added {new Date(branch.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex justify-center mt-8 pb-8">
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
          title="Delete Branch"
          description="Are you sure you want to delete this branch? This action cannot be undone and all data associated with this branch will be permanently removed."
          confirmText="Delete Branch"
          cancelText="Cancel"
          isLoading={deleteMutation.isPending}
          variant="danger"
          icon={Trash2}
        />
      </div>
    </DashboardLayout>
  );
}
