"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardLayout,
  MetricSparklineCard,
  SectionHeader,
  RecentCampaignsList,
} from "@/components";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboard } from "@/features/dashboard/hooks";
import { useCampaigns } from "@/features/campaigns/hooks";
import { useAllLeadLists } from "@/features/leads/hooks";
import { mapDashboardToMetricCards } from "@/features/dashboard/mapToMetricCards";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?.id ?? "";

  const { data: dashData, isLoading: dashLoading } = useDashboard(userId);
  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns(userId);
  const { data: leadListsData } = useAllLeadLists();

  const metricCards = useMemo(() => {
    const dashboard = dashData?.success ? dashData.dashboard : null;
    return mapDashboardToMetricCards(dashboard, !userId || dashLoading);
  }, [dashData, dashLoading, userId]);

  const recentCampaigns = useMemo(() => {
    if (!campaignsData?.success) return [];
    return campaignsData.campaigns.slice(0, 3);
  }, [campaignsData]);

  const leadLists = leadListsData?.leadLists ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((stat) => (
            <MetricSparklineCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              period={stat.period}
              trend={stat.trend}
              isPositive={stat.isPositive}
            />
          ))}
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Recent Campaigns"
            action={{ label: "View All", onClick: () => router.push("/campaigns") }}
          />
          <RecentCampaignsList
            hasUser={!!userId}
            loading={campaignsLoading}
            campaigns={recentCampaigns}
            onRowNavigate={() => router.push("/campaigns")}
            leadLists={leadLists}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
