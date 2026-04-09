"use client";

import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { Button } from "@/components/ui/button";
import { User } from "@/schemas/user";
import { deleteUserService } from "@/services/users/user.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  Loader2,
  Mail,
  Phone,
  Trash2,
  UserPlus,
  Users,
  Eye,
  MapPin,
  Building2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/common/modals/ConfirmationModal";
import Modal from "@/components/common/modal";
import { useState, useCallback, useMemo } from "react";
import Pagination from "@/components/common/Pagination";
import SearchFilter, { FilterConfig } from "@/components/common/SearchFilter";
import { getMyBranches } from "@/services/branch/branch.service";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { getAccessControlList } from "@/services/accesscontrol/accesscontrol.service";
import { get_organization_list } from "@/services/organization/organization.service";

const AllUsersPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortValue, setSortValue] = useState<string>("createdAt-desc");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranchesUser, setSelectedBranchesUser] = useState<User | null>(
    null,
  );

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["organization-list"],
    queryFn: () => get_organization_list(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["access-control", page, limit, search, filters, sortValue],
    queryFn: () =>
      getAccessControlList(page, limit, search, filters, sortValue),
  });

  const groupedUsers = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];

    const usersMap = new Map();

    data.data.forEach((ac: any) => {
      if (!ac.user_id) return;
      const uId = ac.user_id._id;
      if (!usersMap.has(uId)) {
        usersMap.set(uId, {
          _id: uId,
          first_name: ac.user_id.first_name,
          last_name: ac.user_id.last_name,
          email: ac.user_id.email,
          phone: ac.user_id.phone,
          avatar: ac.user_id.avatar,
          organization: ac.org_id,
          branches: ac.branch_id ? [ac.branch_id] : [],
          roles: ac.role_id ? [ac.role_id] : [],
          access_control_id: ac._id,
        });
      } else {
        const existing = usersMap.get(uId);
        if (
          ac.branch_id &&
          !existing.branches.find((b: any) => b?._id === ac.branch_id._id)
        ) {
          existing.branches.push(ac.branch_id);
        }
        if (
          ac.role_id &&
          !existing.roles.find((r: any) => r?._id === ac.role_id._id)
        ) {
          existing.roles.push(ac.role_id);
        }
      }
    });

    return Array.from(usersMap.values());
  }, [data?.data]);

  const { data: branchesData } = useQuery({
    queryKey: ["branches-list-minimal"],
    queryFn: () => getMyBranches(1, 100),
  });

  const branchOptions =
    branchesData?.data && Array.isArray(branchesData.data)
      ? branchesData.data.map((b: any) => ({
        label: b.branch_name,
        value: b._id,
      }))
      : [];

  const orgOptions =
    organizations?.organizations && Array.isArray(organizations.organizations)
      ? organizations.organizations.map((org: any) => ({
        label: org.business_name,
        value: org._id,
      }))
      : [];

  const filterConfigs: FilterConfig[] = [
    {
      key: "org",
      label: "Organization",
      options: orgOptions,
    },
    {
      key: "branch",
      label: "Branch",
      options: branchOptions,
    },
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
      queryClient.invalidateQueries({ queryKey: ["access-control"] });
      toast.success("Access control record deleted successfully");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    },
  });

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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title="Team Users Registry"
          description="Manage organizational access, roles, and user profiles across the platform."
          actions={
            <Button
              onClick={() => router.push("/user-management/add")}
              className="group flex items-center gap-2 h-11 px-5 bg-zinc-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-sm transition-all active:scale-[0.98] shadow-sm"
            >
              <UserPlus
                size={16}
                className="transition-transform group-hover:scale-110"
              />
              <span>Enroll New User</span>
            </Button>
          }
        />

        <div className="w-full">
          <SearchFilter
            onSearch={handleSearch}
            filterConfigs={filterConfigs}
            onFilter={handleFilter}
            onSort={handleSort}
            onReset={handleReset}
            filters={filters}
            placeholder="Identify member by name, email or phone..."
            sortValue={sortValue}
          />

          <div className="mt-8 rounded-sm border border-zinc-200 bg-white overflow-hidden shadow-none">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="size-10 animate-spin text-zinc-900" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                  Loading Registry...
                </p>
              </div>
            ) : groupedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="size-16 rounded-sm bg-zinc-50 flex items-center justify-center border border-zinc-100">
                  <Users className="size-8 text-zinc-300" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                    No users found
                  </p>
                  <p className="text-xs text-zinc-500 max-w-70 mx-auto leading-relaxed">
                    No user profiles found matching your current filters.
                    Adjust your search or enroll a new user.
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-10 px-4 border-zinc-200 text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-50 hover:border-zinc-900 transition-all shadow-none border"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-zinc-50/50 border-b border-zinc-100">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Member Profile
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Organization
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Branch
                          </span>
                        </th>
                        <th className="px-6 py-4 text-center">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Privilege
                          </span>
                        </th>
                        <th className="px-6 py-4 text-right">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Actions
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 bg-white">
                      {groupedUsers.map((user) => (
                        <tr
                          key={user?._id}
                          className="hover:bg-zinc-50/50 transition-colors group"
                        >
                          {/* Member Profile */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 shrink-0 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:bg-black overflow-hidden transition-colors">
                                {user?.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.first_name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <>
                                    {user?.first_name?.[0]}
                                    {user?.last_name?.[0]}
                                  </>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black text-zinc-900 uppercase tracking-tight truncate">
                                  {user?.first_name} {user?.last_name}
                                </span>
                                <div className="flex flex-col mt-0.5">
                                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold tracking-tight">
                                    <Mail size={10} className="text-zinc-400" />
                                    {user?.email}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold tracking-tight">
                                    <Phone
                                      size={10}
                                      className="text-zinc-400"
                                    />
                                    {user?.phone}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Organization */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 shrink-0 rounded-sm bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden">
                                {user?.organization?.business_logo ? (
                                  <img
                                    src={user.organization.business_logo}
                                    alt={user.organization.business_name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Building2
                                    size={14}
                                    className="text-zinc-400"
                                  />
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black text-zinc-900 uppercase tracking-tight truncate">
                                  {user?.organization?.business_name || "N/A"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Branch */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {user?.branches && user?.branches?.length > 0 ? (
                                user?.branches?.length === 1 ? (
                                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                                    <MapPin
                                      size={10}
                                      className="text-zinc-400"
                                    />
                                    {user?.branches[0]?.branch_name}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedBranchesUser(user);
                                      setIsBranchModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-zinc-50 text-zinc-600 text-[10px] font-black uppercase tracking-widest border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all cursor-pointer"
                                  >
                                    <Building2 size={10} />
                                    Multiple ({user.branches.length})
                                  </button>
                                )
                              ) : (
                                <div className="text-[10px] text-zinc-400 font-bold uppercase italic tracking-widest">
                                  Unassigned
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {user.roles && user.roles.length > 0 ? (
                                user.roles.map((r: any) => (
                                  <span
                                    key={r._id}
                                    className="inline-flex items-center px-2 py-0.5 rounded-sm bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest"
                                  >
                                    {r.role_name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-zinc-400 italic">
                                  —
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDetail(user?._id)}
                                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm border border-transparent hover:border-zinc-200 transition-all active:scale-95 cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  handleEdit(user?.access_control_id)
                                }
                                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm border border-transparent hover:border-zinc-200 transition-all active:scale-95 cursor-pointer"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(user?.access_control_id)
                                }
                                disabled={deleteMutation.isPending}
                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-sm border border-transparent hover:border-red-100 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
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

                {data?.meta && (
                  <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between gap-4">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Showing{" "}
                      {Math.min(
                        (page - 1) * limit + 1,
                        data.meta.totalElements,
                      )}
                      –{Math.min(page * limit, data.meta.totalElements)} of{" "}
                      {data.meta.totalElements} users
                    </p>
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
            title="Revoke Member Access"
            description="Are you sure you want to permanently delete this member profile? This will immediately revoke all platform access."
            confirmText="Delete Profile"
            cancelText="Retain Member"
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
                <span className="text-sm font-black uppercase tracking-tight text-zinc-900">
                  Assigned Branch Registry
                </span>
                {selectedBranchesUser && (
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                    Member: {selectedBranchesUser.first_name}{" "}
                    {selectedBranchesUser.last_name}
                  </span>
                )}
              </div>
            }
            maxWidth="md"
          >
            <div className="py-4 space-y-2 text-left">
              {selectedBranchesUser?.branches?.map((branch) => (
                <div
                  key={branch?._id}
                  className="flex items-start gap-4 p-4 rounded-sm border border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <div className="h-10 w-10 shrink-0 rounded-sm bg-zinc-900 flex items-center justify-center text-white">
                    <MapPin size={18} />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight truncate">
                      {branch?.branch_name}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest truncate">
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
