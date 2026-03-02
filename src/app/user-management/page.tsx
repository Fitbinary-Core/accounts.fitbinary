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
  Shield,
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
    branchesData?.data?.map((b: any) => ({
      label: b.branch_name,
      value: b._id,
    })) || [];

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

  const users = data?.data || [];

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
          items={[{ label: "Users" }]}
          icon={Users}
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["users"] })
                }
                className="h-11 w-11 rounded-sm border-gray-200 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <RefreshCw size={18} className="text-gray-500" />
              </Button>
              <Button
                onClick={() => router.push("/user-management/add")}
                className="bg-red-600 cursor-pointer hover:bg-red-700 text-white flex items-center gap-2 px-5 py-5.5 rounded-sm transition-all shadow-md shadow-red-200 border-none"
              >
                <UserPlus size={18} />
                <span>Create User</span>
              </Button>
            </div>
          }
        />

        <div className="p-4 w-full mx-auto space-y-4">
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
              <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-md border border-gray-100 shadow-sm">
                <Loader2 className="h-10 w-10 animate-spin text-red-600 mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">
                  Fetching users...
                </p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-red-600" size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  No Users Found
                </h2>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">
                  Start by creating your team members to collaborate on the
                  platform.
                </p>
                <Button
                  onClick={() => router.push("/user-management/add")}
                  className="mt-8 bg-red-600 hover:bg-red-700 text-white border-none px-8 py-6 rounded-md shadow-lg shadow-red-100 transition-all active:scale-95"
                >
                  <UserPlus size={18} className="mr-2" />
                  <span>Create First User</span>
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                          User Information
                        </th>
                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                          Contact
                        </th>
                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                          Branch
                        </th>
                        <th className="px-6 py-5 text-[11px] text-center font-black uppercase tracking-widest text-gray-400">
                          Role
                        </th>
                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map((user: User) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          {/* Name & ID */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-black border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                {user.first_name[0]}
                                {user.last_name[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                  {user.first_name} {user.middle_name}{" "}
                                  {user.last_name}
                                </p>
                                <div
                                  onClick={() => handleCopyId(user._id)}
                                  className="flex items-center gap-1 group/id cursor-pointer"
                                >
                                  <p className="text-[10px] text-gray-400 font-medium">
                                    {user._id.slice(0, 8)}
                                  </p>
                                  <Copy
                                    size={10}
                                    className="text-gray-600 opacity-0 group-hover/id:opacity-100 transition-opacity hover:text-red-600"
                                  />
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-5">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                <Mail size={12} className="text-red-500/70" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                <Phone size={12} className="text-red-500/70" />
                                <span>{user.phone}</span>
                              </div>
                            </div>
                          </td>

                          {/* Org & Branch */}
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              {user.branches && user.branches.length > 0 ? (
                                user.branches.length === 1 ? (
                                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                                    <span className="h-1 w-1 bg-red-400 rounded-full" />
                                    {user.branches[0].branch_name}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedBranchesUser(user);
                                      setIsBranchModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer shadow-sm"
                                  >
                                    <Building2 size={10} strokeWidth={3} />
                                    View Branches ({user.branches.length})
                                  </button>
                                )
                              ) : (
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                                  <span className="h-1 w-1 bg-red-400 rounded-full" />
                                  {typeof user.branch === "object"
                                    ? (user.branch as any).branch_name
                                    : "Main Branch"}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="px-6 py-5 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest border border-gray-200 shadow-sm transition-all group-hover:bg-red-50 group-hover:text-red-700 group-hover:border-red-100">
                              <Shield size={10} strokeWidth={3} />
                              {typeof user.role === "object"
                                ? user.role.role_name
                                : user.role}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2 duration-300">
                              <button
                                onClick={() => handleDetail(user._id)}
                                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 transition-all shadow-sm active:scale-90 cursor-pointer"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(user._id)}
                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all shadow-sm active:scale-90 cursor-pointer"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                disabled={deleteMutation.isPending}
                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all shadow-sm active:scale-90 cursor-pointer disabled:opacity-50"
                              >
                                {deleteMutation.isPending ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
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
            description="Are you sure you want to delete this user account? This action cannot be undone and the user will lose all access to the system."
            confirmText="Delete User"
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
                <span className="text-xl font-black">Assigned Branches</span>
                {selectedBranchesUser && (
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    User: {selectedBranchesUser.first_name}{" "}
                    {selectedBranchesUser.last_name}
                  </span>
                )}
              </div>
            }
            maxWidth="md"
          >
            <div className="py-6 space-y-4 pr-1 text-left">
              {selectedBranchesUser?.branches?.map((branch) => (
                <div
                  key={branch._id}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-300"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                      {branch.branch_name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      {branch.branch_location}
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
