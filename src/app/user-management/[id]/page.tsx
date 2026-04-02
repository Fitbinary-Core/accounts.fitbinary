"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getUserOneService } from "@/services/users/user.service";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  ArrowLeft,
  Edit2,
  Loader2,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/Layout";

export default function UserDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserOneService(id),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="size-10 animate-spin text-zinc-900" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            Retrieving Member Data...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const user = userResponse?.data;

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center bg-white rounded-sm border border-zinc-200 m-4 shadow-none">
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-tight">
            User Not Found
          </h2>
          <p className="text-zinc-500 mt-2 text-xs">
            The user you are looking for does not exist or has been deleted.
          </p>
          <Button
            onClick={() => router.push("/user-management/users")}
            className="mt-6 bg-zinc-900 hover:bg-black text-white px-6 text-[11px] font-bold uppercase tracking-widest rounded-sm"
          >
            Back to Users
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DashboardBreadcrumb
          title="User Profile"
          description="Detailed view of user account and permissions."
          actions={
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/user-management/users")}
                className="flex items-center gap-2 h-10 px-4 border-zinc-200 text-zinc-900 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-50 hover:border-zinc-900 transition-all shadow-none border"
              >
                <ArrowLeft size={14} />
                <span>Back to Registry</span>
              </Button>
              <Button
                onClick={() => router.push(`/user-management/${id}/edit`)}
                className="bg-zinc-900 hover:bg-black text-white px-6 h-10 text-[11px] font-bold uppercase tracking-widest rounded-sm shadow-none cursor-pointer transition-all active:scale-[0.98]"
              >
                <Edit2 size={14} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-sm border border-zinc-200 p-8 shadow-none text-center">
              <div className="h-24 w-24 rounded-sm bg-zinc-100 flex items-center justify-center text-zinc-900 font-black text-3xl border border-zinc-200 mx-auto mb-6 shadow-none tracking-tighter overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </>
                )}
              </div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight uppercase">
                {user.first_name} {user.middle_name} {user.last_name}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-sm bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest">
                <Shield size={10} strokeWidth={3} />
                {typeof user.role === "object"
                  ? user.role.role_name
                  : user.role}
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-100 space-y-5">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-9 w-9 rounded-sm bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Email Address
                    </p>
                    <p className="text-xs font-bold text-zinc-900">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="h-9 w-9 rounded-sm bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Phone Number
                    </p>
                    <p className="text-xs font-bold text-zinc-900">
                      {user.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="h-9 w-9 rounded-sm bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Joined Date
                    </p>
                    <p className="text-xs font-bold text-zinc-900">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Information */}
            <div className="bg-white rounded-sm border border-zinc-200 p-8 shadow-none">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <Briefcase size={14} className="text-zinc-900" />
                Work Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-sm bg-zinc-50 border border-zinc-100 group hover:border-zinc-900 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-sm bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-900 transition-all">
                      <MapPin size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Assigned Branches
                    </span>
                  </div>
                  <div className="space-y-3">
                    {user.branches && user.branches.length > 0 ? (
                      user.branches.map((branch: any) => (
                        <div
                          key={branch._id}
                          className="pb-3 last:pb-0 border-b last:border-0 border-zinc-100"
                        >
                          <p className="text-sm font-black text-zinc-900 tracking-tight uppercase">
                            {branch.branch_name}
                          </p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            {branch.branch_location}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] font-bold text-zinc-400 italic uppercase">
                        No branches assigned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-sm border border-zinc-200 p-8 shadow-none">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <ShieldCheck size={14} className="text-zinc-900" />
                Role Permissions
              </h3>

              {typeof user.role === "object" &&
              user.role.permissions &&
              user.role.permissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {user.role.permissions.map((perm: any) => (
                    <div
                      key={perm._id}
                      className="flex items-center gap-3 p-4 rounded-sm bg-zinc-50 border border-zinc-100 group hover:bg-zinc-900 transition-all duration-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 group-hover:bg-white" />
                      <div>
                        <p className="text-[10px] font-black text-zinc-900 group-hover:text-white leading-none mb-1 uppercase tracking-tight">
                          {perm.label}
                        </p>
                        <p className="text-[8px] font-bold text-zinc-400 group-hover:text-zinc-500 uppercase tracking-widest">
                          {perm.key}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 rounded-sm bg-zinc-50/50 border border-dashed border-zinc-200">
                  <Shield className="h-10 w-10 text-zinc-200 mb-3" />
                  <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                    No individual permissions found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
