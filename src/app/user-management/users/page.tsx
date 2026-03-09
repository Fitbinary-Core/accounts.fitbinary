"use client";

import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { Button } from "@/components/ui/button";
import { User } from "@/schemas/user";
import {
  deleteUserService,
  getUsersListService,
} from "@/services/users/user.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  Loader2,
  Mail,
  Phone,
  Trash2,
  UserPlus,
  Users,
  Copy,
  Eye,
  RefreshCw,
  MapPin,
  Building2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/common/modals/ConfirmationModal";
import Modal from "@/components/common/modal";
import { useState, useCallback } from "react";
import Pagination from "@/components/common/Pagination";
import SearchFilter, { FilterConfig } from "@/components/common/SearchFilter";
import { getMyBranches } from "@/services/branch/branch.service";
import { get_user_roles_list } from "@/services/roles/roles.services";
import { DashboardLayout } from "@/components/dashboard/Layout";

const AllUsersPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortValue, setSortValue] = useState<string>("createdAt-desc");

  const [sortField, sortOrder] = sortValue
    ? sortValue.split("-")
    : [undefined, undefined];

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit, search, filters, sortValue],
    queryFn: () =>
      getUsersListService({
        page,
        limit,
        search,
        branch: filters.branch,
        role: filters.role,
        sort: sortField,
        order: sortOrder as "asc" | "desc",
      }),
  });

  const { data: branchesData } = useQuery({
    queryKey: ["branches-list-minimal"],
    queryFn: () => getMyBranches(1, 100),
  });

  const { data: rolesData } = useQuery({
    queryKey: ["roles-list-minimal"],
    queryFn: () => get_user_roles_list(),
  });

  const branchOptions =
    branchesData?.data && Array.isArray(branchesData.data)
      ? branchesData.data.map((b: any) => ({
          label: b.branch_name,
          value: b._id,
        }))
      : [];

  const roleOptions =
    rolesData?.data?.map((r: any) => ({
      label: r.role_name,
      value: r._id,
    })) || [];

  const filterConfigs: FilterConfig[] = [
    {
      key: "branch",
      label: "Branch",
      options: branchOptions,
    },
    {
      key: "role",
      label: "Role",
      options: roleOptions,
    },
  ];

  const sortOptions = [
    { label: "Newest First", value: "createdAt-desc" },
    { label: "Oldest First", value: "createdAt-asc" },
    { label: "Name: A-Z", value: "first_name-asc" },
    { label: "Name: Z-A", value: "first_name-desc" },
  ];

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const handleFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      if (value === "") {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
    setPage(1);
  }, []);

  const handleSort = useCallback((value: string) => {
    setSortValue(value);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearch("");
    setFilters({});
    setSortValue("createdAt-desc");
    setPage(1);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranchesUser, setSelectedBranchesUser] = useState<User | null>(
    null,
  );

const users = Array.isArray(data?.data) ? data.data : [];

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copied to clipboard", {
      style: {
        fontSize: "10px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "1px",
      },
    });
  };

  const handleEdit = (id: string) => {
    router.push(`/user-management/${id}/edit`);
  };

  const handleDetail = (id: string) => {
    router.push(`/user-management/${id}`);
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full bg-gray-50/30 min-h-full pb-10">
        <DashboardBreadcrumb
          title="Users Management"
          description="View and manage users who have access to your system."
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["users"] })
                }
                className="h-9 w-9 rounded-sm border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-none"
              >
                <RefreshCw size={16} className="text-gray-500" />
              </Button>
              <Button
                onClick={() => router.push("/user-management/add")}
                className="bg-zinc-900 cursor-pointer hover:bg-black text-white flex items-center gap-2 px-4 py-2 h-9 rounded-sm transition-all border-none shadow-sm"
              >
                <UserPlus size={16} />
                <span className="text-sm">Create User</span>
              </Button>
            </div>
          }
        />

        <div className="w-full mx-auto space-y-4">
          <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100/50">
              <SearchFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSort={handleSort}
                onReset={handleReset}
                filterConfigs={filterConfigs}
                sortOptions={sortOptions}
                placeholder="Search users..."
                filters={filters}
                sortValue={sortValue}
                initialSearch={search}
              />
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-sm border border-gray-100 shadow-none">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-900 mb-4" />
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Fetching users...
                </p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-sm border border-gray-100 p-12 text-center shadow-none">
                <div className="bg-gray-50 w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Users className="text-zinc-400" size={32} />
                </div>
                <h2 className="text-xl font-bold text-zinc-900">
                  No Users Found
                </h2>
                <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">
                  Start by creating your team members to collaborate on the
                  platform.
                </p>
                <Button
                  onClick={() => router.push("/user-management/add")}
                  className="mt-6 bg-zinc-900 hover:bg-black text-white border-none px-6 py-2 h-10 rounded-sm shadow-sm transition-all active:scale-95"
                >
                  <UserPlus size={16} className="mr-2" />
                  <span className="text-sm">Create First User</span>
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          User & Organization
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          App
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Branch
                        </th>
                        <th className="px-4 py-3 text-[10px] text-center font-bold uppercase tracking-wider text-gray-500">
                          Role
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users?.map((user: User) => (
                        <tr
                          key={user?._id}
                          className="hover:bg-gray-50/30 transition-colors border-b border-gray-100"
                        >
                          {/* Name & ID */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-sm bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                {user?.first_name[0]}
                                {user?.last_name[0]}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 leading-none">
                                  {user?.first_name} {user?.middle_name}{" "}
                                  {user?.last_name}
                                </p>
                                <div className="flex flex-col gap-0.5 mt-1">
                                  <div className="flex items-center gap-1.5">
                                    {user?.organization?.business_logo && (
                                      <img
                                        src={user?.organization?.business_logo}
                                        alt=""
                                        className="h-3 w-3 rounded-sm object-cover border border-gray-100"
                                      />
                                    )}
                                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-tight">
                                      {user?.organization?.business_name}
                                    </span>
                                  </div>
                                  <div
                                    onClick={() => handleCopyId(user?._id)}
                                    className="flex items-center gap-1 cursor-pointer w-fit"
                                  >
                                    <p className="text-[9px] text-gray-400 font-medium">
                                      ID: {user?._id.slice(0, 8)}
                                    </p>
                                    <Copy
                                      size={8}
                                      className="text-gray-400 hover:text-zinc-900"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                <Mail size={11} className="text-gray-400" />
                                <span>{user?.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                <Phone size={11} className="text-gray-400" />
                                <span>{user?.phone}</span>
                              </div>
                            </div>
                          </td>

                          {/* App */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                              {user?.app?.name || "N/A"}
                            </span>
                          </td>

                          {/* Org & Branch */}
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              {user?.branches && user?.branches?.length > 0 ? (
                                user?.branches?.length === 1 ? (
                                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold uppercase">
                                    <MapPin
                                      size={10}
                                      className="text-gray-400"
                                    />
                                    {user?.branches[0]?.branch_name}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedBranchesUser(user);
                                      setIsBranchModalOpen(true);
                                    }}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wide border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                                  >
                                    <Building2 size={10} strokeWidth={2} />
                                    Branches ({user?.branches?.length})
                                  </button>
                                )
                              ) : (
                                <div className="text-[10px] text-gray-400 font-semibold uppercase italic">
                                  Unassigned
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide border border-blue-100">
                              {typeof user.role === "object"
                                ? user?.role?.role_name
                                : user?.role}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleDetail(user?._id)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm border border-transparent hover:border-blue-100 transition-all active:scale-95 cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleEdit(user?._id)}
                                className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm border border-transparent hover:border-zinc-200 transition-all active:scale-95 cursor-pointer"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(user?._id)}
                                disabled={deleteMutation.isPending}
                                className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm border border-transparent hover:border-zinc-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                {deleteMutation.isPending ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Summary & Pagination */}
                {data?.meta && (
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center">
                    {data.meta.totalPages > 1 && (
                      <Pagination
                        page={data.meta.page}
                        total={data.meta.totalPages}
                        onChange={(newPage) => setPage(newPage)}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Delete User"
            description="Are you sure you want to delete this user account? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={deleteMutation.isPending}
            variant="danger"
            icon={Trash2}
          />

          <Modal
            isOpen={isBranchModalOpen}
            onClose={() => {
              setIsBranchModalOpen(false);
              setSelectedBranchesUser(null);
            }}
            title={
              <div className="flex flex-col">
                <span className="text-lg font-bold">Assigned Branches</span>
                {selectedBranchesUser && (
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                    User: {selectedBranchesUser.first_name}{" "}
                    {selectedBranchesUser.last_name}
                  </span>
                )}
              </div>
            }
            maxWidth="md"
          >
            <div className="py-4 space-y-2 pr-1 text-left">
              {selectedBranchesUser?.branches?.map((branch) => (
                <div
                  key={branch?._id}
                  className="flex items-start gap-3 p-3 rounded-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-8 w-8 shrink-0 rounded-sm bg-gray-100 flex items-center justify-center text-gray-500">
                    <MapPin size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-gray-900">
                      {branch?.branch_name}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {branch?.branch_location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllUsersPage;
