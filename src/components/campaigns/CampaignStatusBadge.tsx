"use client";

import { cn } from "@/lib/utils";
import type { Campaign } from "@/features/campaigns/calls";

const statusStyles: Record<Campaign["status"], string> = {
  running: "bg-emerald-500/10 text-emerald-500",
  paused: "bg-amber-500/10 text-amber-500",
  draft: "bg-secondary text-muted-foreground",
  completed: "bg-secondary text-muted-foreground",
};

export function CampaignStatusBadge({ status }: { status: Campaign["status"] }) {
  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
