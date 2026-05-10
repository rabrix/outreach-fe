import type { Campaign, CampaignListStats } from "./calls";
import { formatShortDateTime, replyRatePercent1dp } from "@/lib/format";

export type CampaignListMetrics = {
  enrolled: number;
  sent: number;
  replies: number;
  replyPct: string;
  lastSent: string;
  stepCount: number;
  gmailCount: number;
  dominantStep: number | null;
};

export function campaignStatusLabel(status: Campaign["status"]): string {
  if (status === "running") return "Active";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function safeStats(c: Campaign): CampaignListStats | undefined {
  return c.stats;
}

/** Normalized numbers/strings for list cards and summary rows (pure). */
export function getCampaignListMetrics(campaign: Campaign): CampaignListMetrics {
  const st = safeStats(campaign);
  const enrolled = st?.currentStepStatus?.enrolledLeads ?? 0;
  const sent = st?.emailsSent ?? 0;
  const replies = st?.replies ?? 0;
  return {
    enrolled,
    sent,
    replies,
    replyPct: replyRatePercent1dp(sent, replies),
    lastSent: formatShortDateTime(st?.lastSentAt ?? null),
    stepCount: campaign.steps?.length ?? 0,
    gmailCount: campaign.gmailAccounts?.length ?? 0,
    dominantStep: st?.currentStepStatus?.dominantStep ?? null,
  };
}
