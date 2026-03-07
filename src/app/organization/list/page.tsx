"use client";

import { DashboardLayout } from "@/components/dashboard/Layout";
import { get_organization_list } from "@/services/organization/organization.service";
import { useQuery } from "@tanstack/react-query";
import { Building2, Search, User, Globe, Calendar, MapPin } from "lucide-react";
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
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-zinc-200">
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-sm text-sm focus:border-zinc-900 transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded-sm border border-zinc-200">
                Total: {orgs.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-32 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <div className="size-12 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
                  <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 text-zinc-200" />
                </div>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                  Fetching Records...
                </p>
              </div>
            ) : orgs.length === 0 ? (
              <div className="p-24 flex flex-col items-center justify-center text-center gap-4">
                <div className="size-16 bg-zinc-50 rounded-sm flex items-center justify-center border border-zinc-100">
                  <Building2 className="size-8 text-zinc-200" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900">
                    No Entities Registered
                  </h3>
                  <p className="text-zinc-500 max-w-xs mx-auto text-xs font-medium">
                    You haven't setup any organizations yet.
                  </p>
                </div>
                <Link
                  href="/organization/create"
                  className="px-6 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-all"
                >
                  Create Organization
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-250">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Business Identity
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Business Size
                    </th>
                    <th className="px-5 py-3 text-[10px] text-center font-bold text-zinc-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Localization
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Created
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
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-8 shrink-0 rounded-sm bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden">
                            {org.business_logo ? (
                              <img
                                src={org.business_logo}
                                alt={org.business_name}
                                className="size-full object-cover"
                              />
                            ) : (
                              <Building2 className="size-4 text-zinc-300" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-zinc-900 truncate leading-tight">
                              {org.business_name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-zinc-700 font-semibold truncate max-w-30">
                                {org.business_email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Business Size */}
                      <td className="px-5 py-3 text-left font-medium">
                        <span className="text-xs font-bold text-zinc-700">
                          {org.business_size}
                        </span>
                      </td>

                      {/* Owner Info */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-sm bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden">
                            {org.tenant?.avatar ? (
                              <img
                                src={org.tenant.avatar}
                                className="size-full object-cover"
                              />
                            ) : (
                              <User className="size-3 text-zinc-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-800 leading-tight">
                              {org.tenant?.first_name} {org.tenant?.last_name}
                            </span>
                            <span className="text-xs text-zinc-700 font-medium">
                              {org.tenant?.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Localization */}
                      <td className="px-5 py-3 font-medium">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-zinc-600">
                            <Globe className="size-3 text-zinc-600" />
                            <span className="text-xs">
                              {org.country || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-600">
                            <MapPin className="size-3" />
                            <span className="text-xs truncate max-w-25">
                              {org.district || org.municipality || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        {org.onboarding_completed ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 w-fit bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-sm border border-emerald-100">
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-0.5 w-fit bg-zinc-50 text-zinc-500 text-[10px] font-bold uppercase rounded-sm border border-zinc-200">
                            Pending
                          </div>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-zinc-700">
                          <Calendar className="size-3" />
                          <span className="text-[10px] font-bold">
                            {formatDate(org.createdAt)}
                          </span>
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
