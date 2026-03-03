"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getUserOneService } from "@/services/users/user.service";
import DashboardBreadcrumb from "@/components/common/DashboardBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
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

export default function UserDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserOneService(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  const user = userResponse?.data;

  if (!user) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 m-4">
        <h2 className="text-2xl font-black text-gray-900">User Not Found</h2>
        <p className="text-gray-500 mt-2">
          The user you are looking for does not exist or has been deleted.
        </p>
        <Button
          onClick={() => router.push("/user-management/users")}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white border-none px-6"
        >
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50/30 min-h-screen pb-12">
      <DashboardBreadcrumb
        title="User Profile"
        description="Detailed view of user account and permissions."
        actions={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/user-management")}
              className="px-5 border-gray-200 text-gray-600 hover:bg-white hover:text-red-600 font-bold uppercase text-[11px] tracking-widest cursor-pointer"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <Button
              onClick={() => router.push(`/user-management/${id}/edit`)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-red-100 border-none cursor-pointer"
            >
              <Edit2 size={16} className="mr-2" />
              Edit User
            </Button>
          </div>
        }
      />

      <div className="p-4 w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
            <div className="h-24 w-24 rounded-3xl bg-red-50 flex items-center justify-center text-red-600 font-black text-3xl border-2 border-red-100 mx-auto mb-6 shadow-inner tracking-tighter">
              {user.first_name[0]}
              {user.last_name[0]}
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {user.first_name} {user.middle_name} {user.last_name}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-100">
              <Shield size={10} strokeWidth={3} />
              {typeof user.role === "object" ? user.role.role_name : user.role}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors border border-gray-100 shadow-sm">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Email Address
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-left">
                <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors border border-gray-100 shadow-sm">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Phone Number
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {user.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-left">
                <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors border border-gray-100 shadow-sm">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Joined Date
                  </p>
                  <p className="text-sm font-bold text-gray-700">
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
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <Briefcase size={14} className="text-red-500" />
              Work Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:border-red-100 hover:bg-red-50/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-red-600 group-hover:border-red-200 transition-all shadow-sm">
                    <MapPin size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Branch
                  </span>
                </div>
                <div className="space-y-1">
                  {user.branches && user.branches.length > 0 ? (
                    user.branches.map((branch: any) => (
                      <div key={branch._id} className="mb-2 last:mb-0">
                        <p className="text-lg font-black text-gray-800 tracking-tight">
                          {branch.branch_name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                          {branch.branch_location}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-bold text-gray-500 italic">
                      No branches assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <ShieldCheck size={14} className="text-red-500" />
              Role Permissions
            </h3>

            {typeof user.role === "object" &&
              user.role.permissions &&
              user.role.permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {user.role.permissions.map((perm: any) => (
                  <div
                    key={perm._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:border-red-100 hover:shadow-md hover:shadow-red-50 transition-all duration-300"
                  >
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse group-hover:bg-red-600" />
                    <div>
                      <p className="text-[11px] font-black text-gray-900 leading-none mb-1">
                        {perm.label}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {perm.key}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-gray-50/30 border border-dashed border-gray-200">
                <Shield className="h-10 w-10 text-gray-200 mb-3" />
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                  No detailed permissions found for this role
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
