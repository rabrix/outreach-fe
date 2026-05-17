"use client";

import type { Campaign } from "@/features/campaigns/calls";
import type { LeadList } from "@/features/leads/calls";
import { campaignStatusLabel, getCampaignListMetrics } from "@/features/campaigns/listMetrics";
import { formatLastSentLabel, replyRatePercentInt } from "@/lib/format";

type RecentCampaignRowProps = {
  campaign: Campaign;
  index: number;
  onNavigate: () => void;
  leadList?: LeadList;
};

export function RecentCampaignRow({ campaign, index, onNavigate, leadList }: RecentCampaignRowProps) {
  const m = getCampaignListMetrics(campaign);
  const statusLabel = campaignStatusLabel(campaign.status);
  const initial = campaign.name.charAt(0).toUpperCase() || String(index + 1);
  const replyPct = replyRatePercentInt(m.sent, m.replies);

  return (
    <button
      type="button"
      onClick={onNavigate}
      className="w-full text-left p-4 hover:bg-secondary/50 transition flex items-center gap-4"
    >
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">{campaign.name}</h4>
        <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
          <span
            className={`inline-block w-2 h-2 rounded-full shrink-0 ${
              campaign.status === "running" ? "bg-emerald-500" : "bg-muted-foreground"
            }`}
          />
          <span>
            {statusLabel} · {leadList ? `${leadList.name} (${leadList.leadsCount ?? leadList.leadCount ?? 0} leads)` : `${m.enrolled.toLocaleString()} enrolled`} · {replyPct}% reply rate
          </span>
        </p>
      </div>
      <div className="text-right hidden sm:block shrink-0">
        <p className="text-sm font-bold text-foreground">{m.sent.toLocaleString()} sent</p>
        <p className="text-xs text-muted-foreground">
          Last sent {formatLastSentLabel(campaign.stats?.lastSentAt ?? null)}
        </p>
      </div>
    </button>
  );
}
