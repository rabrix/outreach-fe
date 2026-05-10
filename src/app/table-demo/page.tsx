"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/Table";
import {
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  Check,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components";

// --- Specialty Cell Components ---

/**
 * StatusBadgeCell - Renders a pill with a dot and themed colors
 */
interface StatusBadgeCellProps {
  status: "peak" | "decline" | "growth" | "stable";
}

const StatusBadgeCell = ({ status }: StatusBadgeCellProps) => {
  const configs = {
    peak: {
      bg: "bg-emerald-50",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      label: "Peak"
    },
    growth: {
      bg: "bg-blue-50",
      dot: "bg-blue-500",
      text: "text-blue-700",
      label: "Growth"
    },
    decline: {
      bg: "bg-rose-50",
      dot: "bg-rose-500",
      text: "text-rose-700",
      label: "Decline"
    },
    stable: {
      bg: "bg-slate-50",
      dot: "bg-slate-500",
      text: "text-slate-700",
      label: "Stable"
    }
  };

  const config = configs[status];

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold", config.bg, config.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </div>
  );
};

/**
 * ConditionalMetricCell - Renders colored text based on numeric thresholds
 */
interface ConditionalMetricCellProps {
  value: number;
  suffix?: string;
}

const ConditionalMetricCell = ({ value, suffix = "%" }: ConditionalMetricCellProps) => {
  let colorClass = "text-amber-600";
  let Icon = Activity;

  if (value >= 90) {
    colorClass = "text-emerald-600";
    Icon = TrendingUp;
  } else if (value < 50) {
    colorClass = "text-rose-600";
    Icon = TrendingDown;
  }

  return (
    <div className={cn("flex items-center gap-2 font-semibold", colorClass)}>
      <Icon className="w-4 h-4" />
      <span>{value}{suffix}</span>
    </div>
  );
};

/**
 * CurrencyCell - Formats numbers as currency
 */
interface CurrencyCellProps {
  amount: number;
  currency?: string;
}

const CurrencyCell = ({ amount, currency = "USD" }: CurrencyCellProps) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return <span className="font-mono font-medium text-gray-900">{formatted}</span>;
};

/**
 * ActionCell - Right-aligned cell with ellipsis button
 */
const ActionCell = () => {
  return (
    <div className="flex justify-end">
      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-all">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};

// --- Mock Data ---

interface MarketingData {
  id: string;
  period: string;
  season: "peak" | "decline" | "growth" | "stable";
  targetCoeff: number;
  actualCoeff: number;
  revenue: number;
  targetMetric: number;
}

const mockData: MarketingData[] = [
  { id: "1", period: "Q1 2024", season: "growth", targetCoeff: 0.85, actualCoeff: 0.88, revenue: 1250000, targetMetric: 92 },
  { id: "2", period: "Q2 2024", season: "peak", targetCoeff: 0.95, actualCoeff: 0.97, revenue: 2450000, targetMetric: 98 },
  { id: "3", period: "Q3 2024", season: "stable", targetCoeff: 0.70, actualCoeff: 0.65, revenue: 980000, targetMetric: 45 },
  { id: "4", period: "Q4 2024", season: "decline", targetCoeff: 0.40, actualCoeff: 0.35, revenue: 540000, targetMetric: 32 },
  { id: "5", period: "Q1 2025", season: "growth", targetCoeff: 0.80, actualCoeff: 0.82, revenue: 1100000, targetMetric: 88 },
];

// --- Main Page Component ---

export default function TableDemoPage() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleAll = () => {
    if (selectedRows.size === mockData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(mockData.map(d => d.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Comprehensive overview of marketing coefficients and seasonal revenue targets.</p>
        </div>

        <div className="bg-card border border-border shadow-2xl shadow-gray-200/50 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[50px]">
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer transition-all",
                      selectedRows.size === mockData.length ? "bg-primary border-primary" : "bg-white"
                    )}
                    onClick={toggleAll}
                  >
                    {selectedRows.size === mockData.length && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <span>Period</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Target Coeff</TableHead>
                <TableHead>Actual Coeff</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Target Metric</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableRow key={row.id} className={cn(selectedRows.has(row.id) && "bg-primary/5")}>
                  <TableCell>
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer transition-all",
                        selectedRows.has(row.id) ? "bg-primary border-primary" : "bg-white"
                      )}
                      onClick={() => toggleRow(row.id)}
                    >
                      {selectedRows.has(row.id) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {row.period}
                  </TableCell>
                  <TableCell>
                    <StatusBadgeCell status={row.season} />
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">{(row.targetCoeff * 100).toFixed(0)}%</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900 font-medium">{(row.actualCoeff * 100).toFixed(0)}%</span>
                  </TableCell>
                  <TableCell>
                    <CurrencyCell amount={row.revenue} />
                  </TableCell>
                  <TableCell>
                    <ConditionalMetricCell value={row.targetMetric} />
                  </TableCell>
                  <TableCell>
                    <ActionCell />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
