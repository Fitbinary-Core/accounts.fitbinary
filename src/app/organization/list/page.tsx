"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { get_organization_list } from "@/services/organization/organization.service";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Search,
  Edit2,
  User,
  Globe,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { IOrganization } from "@/types/organization";

export default function OrganizationListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["organization-list"],
    queryFn: () => get_organization_list(),
  });

  const orgs = data?.organizations || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-widest rounded-full">
                Administration
              </span>
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
              Organizations
            </h1>
            <p className="text-zinc-500 max-w-lg">
              View and manage your registered corporate entities, their
              ownership details, and localization settings.
            </p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4 bg-zinc-50/30">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name, email or owner..."
                className="w-full h-11 pl-11 pr-4 bg-white border border-zinc-200 rounded-2xl text-sm focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red/20 transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-full">
                Total: {orgs.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-32 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <div className="size-16 border-4 border-zinc-100 border-t-brand-red rounded-full animate-spin"></div>
                  <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 text-zinc-200" />
                </div>
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                  Fetching Data Records...
                </p>
              </div>
            ) : orgs.length === 0 ? (
              <div className="p-32 flex flex-col items-center justify-center text-center gap-6">
                <div className="size-24 bg-zinc-50 rounded-[40px] flex items-center justify-center border border-zinc-100">
                  <Building2 className="size-10 text-zinc-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900">
                    No Entities Registered
                  </h3>
                  <p className="text-zinc-500 max-w-xs mx-auto text-sm">
                    You haven't setup any organizations yet. Start your journey
                    by creating an entity.
                  </p>
                </div>
                <Link
                  href="/organization/create"
                  className="px-6 py-3 bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
                >
                  Get Started Now
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-250">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Business Identity
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Owner/Tenant
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Localization
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Created
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orgs.map((org: IOrganization) => (
                    <tr
                      key={org._id}
                      className="group hover:bg-zinc-50/80 transition-all duration-300"
                    >
                      {/* Business Entity */}
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative size-10 shrink-0 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                            {org.business_logo ? (
                              <img
                                src={org.business_logo}
                                alt={org.business_name}
                                className="size-full object-cover"
                                onError={(e) => {
                                  (e.target as any).src =
                                    "https://ui-avatars.com/api/?name=" +
                                    org.business_name +
                                    "&background=f4f4f5&color=a1a1aa";
                                }}
                              />
                            ) : (
                              <Building2 className="size-6 text-zinc-300" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-zinc-900 group-hover:text-brand-red transition-colors truncate">
                              {org.business_name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-zinc-600 font-bold tracking-wider truncate max-w-37.5">
                                {org.business_email}
                              </span>
                              <span className="size-1 bg-zinc-200 rounded-full" />
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                {org.business_size}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner Info */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-brand-red/5 border border-brand-red/10 flex items-center justify-center overflow-hidden">
                            {org.tenant?.avatar ? (
                              <img
                                src={org.tenant.avatar}
                                className="size-full object-cover"
                              />
                            ) : (
                              <User className="size-4 text-brand-red" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-700 leading-tight">
                              {org.tenant?.first_name} {org.tenant?.last_name}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {org.tenant?.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Localization */}
                      <td className="px-6 py-6 font-medium">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-zinc-600">
                            <Globe className="size-3 text-zinc-400" />
                            <span className="text-xs">
                              {org.country || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <MapPin className="size-3" />
                            <span className="text-[10px] truncate max-w-30">
                              {org.district || org.municipality || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-6">
                        {org.onboarding_completed ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 w-fit bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full border border-emerald-100 shadow-sm shadow-emerald-100/20">
                            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 w-fit bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full border border-amber-100 shadow-sm shadow-amber-100/20">
                            <div className="size-1.5 bg-amber-500 rounded-full" />
                            Pending
                          </div>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Calendar className="size-3.5" />
                          <span className="text-[11px] font-bold">
                            {formatDate(org.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/organization/${org._id}/edit`}
                            className="size-9 bg-white border border-zinc-200 text-zinc-400 hover:text-brand-red hover:border-brand-red/20 hover:shadow-lg hover:shadow-brand-red/5 transition-all rounded-xl flex items-center justify-center group/btn"
                            title="Edit Organization"
                          >
                            <Edit2 className="size-4 group-hover/btn:scale-110 transition-transform" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
