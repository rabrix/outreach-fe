"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLeadsByList, useLeadList, useDeleteLead } from "@/features/leads/hooks";
import { DashboardLayout } from "@/components";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/Table";
import {
  ArrowLeft,
  MoreHorizontal,
  ArrowUpDown,
  Filter,
  ChevronDown,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

const safeDate = (dateStr: any) => {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

type SortField = "createdAt" | "averagePrice" | "rating";
type SortOrder = "asc" | "desc";

export default function LeadListDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: leadListData, isLoading: isLoadingList } = useLeadList(id);
  const { data: leadsData, isLoading: isLoadingLeads } = useLeadsByList(id);
  const deleteLeadMutation = useDeleteLead();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const parsePrice = (price?: string) => {
    if (!price) return 0;
    const match = price.replace(/[^0-9.]/g, '');
    const val = parseFloat(match) || 0;
    if (price.toUpperCase().includes('M')) return val * 1000000;
    if (price.toUpperCase().includes('K')) return val * 1000;
    return val;
  };

  const filteredAndSortedLeads = useMemo(() => {
    if (!leadsData?.leads) return [];

    let result = [...leadsData.leads];

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(lead => lead.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === "averagePrice") {
        valA = parsePrice(a.averagePrice);
        valB = parsePrice(b.averagePrice);
      } else if (sortField === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return result;
  }, [leadsData, statusFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLeadMutation.mutate(leadId, {
        onSuccess: () => toast.success("Lead deleted"),
        onError: (err: any) => toast.error(err.message || "Delete failed"),
      });
    }
  };

  if (isLoadingList || isLoadingLeads) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">Loading lead list details...</p>
        </div>
      </DashboardLayout>
    );
  }

  const leadList = leadListData?.leadList;

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/prospects?tab=VIEW")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prospects
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{leadList?.name || "Lead List"}</h1>
              <p className="text-muted-foreground mt-1">
                Total of {leadsData?.leads?.length || 0} leads in this collection.
              </p>
            </div>

            {/* Filters Toolbar */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  className="pl-10 pr-8 py-2 bg-card border border-border rounded-xl text-sm font-medium appearance-none focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="replied">Replied</option>
                  <option value="noreply">No Reply</option>
                  <option value="bounced">Bounced</option>
                  <option value="stopped">Stopped</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-card border border-border shadow-2xl shadow-gray-200/50 rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[250px]">Lead Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("rating")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors uppercase"
                  >
                    Rating
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("averagePrice")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors uppercase"
                  >
                    Avg Price
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("createdAt")}
                    className="flex items-center gap-2 hover:text-foreground transition-colors uppercase"
                  >
                    Added On
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedLeads.length > 0 ? (
                filteredAndSortedLeads.map((lead) => (
                  <TableRow key={lead.id} className="group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{lead.name || `${lead.firstName} ${lead.lastName}`}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{lead.agency}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs">{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span className="text-xs">{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="font-bold">{lead.rating || 0}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">/ 5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-semibold text-gray-700">{lead.averagePrice || "N/A"}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {format(safeDate(lead.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                      <Filter className="w-8 h-8 opacity-20 mb-2" />
                      <p className="font-medium">No leads match your criteria</p>
                      <button
                        onClick={() => setStatusFilter("all")}
                        className="text-primary text-sm hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; dot: string }> = {
    pending: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400" },
    contacted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    replied: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    noreply: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
    bounced: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
    stopped: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  };

  const config = configs[status] || configs.pending;

  return (
    <div className={cn("inline-flex outline outline-1 outline-gray-200 items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", config.bg, config.text)}>
      <span className={cn("w-2 h-2 rounded-full", config.dot)} />
      {status}
    </div>
  );
}
