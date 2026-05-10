import type { DashboardPayload } from "./calls";
import {
  formatCompactCount,
  formatSignedPercent1dp,
  formatSignedPercent2dp,
} from "@/lib/format";

export type MetricCardViewModel = {
  title: string;
  value: string;
  period: string;
  trend: string;
  isPositive: boolean;
};

function placeholderRow(title: string): MetricCardViewModel {
  return { title, value: "—", period: "…", trend: "…", isPositive: true };
}

/** Maps API dashboard → MetricSparklineCard props (pure). */
export function mapDashboardToMetricCards(
  dashboard: DashboardPayload | null,
  loading: boolean
): MetricCardViewModel[] {
  if (loading || !dashboard) {
    return [
      placeholderRow("Active Campaigns"),
      placeholderRow("Total Prospects"),
      placeholderRow("Emails Sent"),
      placeholderRow("Average Reply Rate"),
    ];
  }

  const d = dashboard;
  const replyDelta = d.averageReplyRate.percent - d.averageReplyRate.lastWeekPercent;

  return [
    {
      title: "Active Campaigns",
      value: formatCompactCount(d.activeCampaigns.value),
      period: d.activeCampaigns.comparison,
      trend: formatSignedPercent1dp(d.activeCampaigns.changePercent),
      isPositive: d.activeCampaigns.changePercent >= 0,
    },
    {
      title: "Total Prospects",
      value: formatCompactCount(d.totalProspects.value),
      period: d.totalProspects.comparison,
      trend: formatSignedPercent1dp(d.totalProspects.changePercent),
      isPositive: d.totalProspects.changePercent >= 0,
    },
    {
      title: "Emails Sent",
      value: formatCompactCount(d.emailsSent.value),
      period: d.emailsSent.comparison,
      trend: formatSignedPercent1dp(d.emailsSent.changePercent),
      isPositive: d.emailsSent.changePercent >= 0,
    },
    {
      title: "Average Reply Rate",
      value: `${d.averageReplyRate.percent.toFixed(2)}%`,
      period: "Last week",
      trend: formatSignedPercent2dp(replyDelta),
      isPositive: replyDelta >= 0,
    },
  ];
}
