"use client";

import type { Campaign } from "@/features/campaigns/calls";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { RecentCampaignRow } from "./RecentCampaignRow";

type RecentCampaignsListProps = {
  hasUser: boolean;
  loading: boolean;
  campaigns: Campaign[];
  onRowNavigate: () => void;
};

export function RecentCampaignsList({
  hasUser,
  loading,
  campaigns,
  onRowNavigate,
}: RecentCampaignsListProps) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="divide-y divide-border">
        {!hasUser ? (
          <p className="p-8 text-center text-muted-foreground text-sm">Sign in to see your campaigns.</p>
        ) : loading ? (
          <div className="p-8 flex justify-center">
            <Spinner />
          </div>
        ) : campaigns.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground text-sm">
            No campaigns yet. Create one from the Campaigns page.
          </p>
        ) : (
          campaigns.map((campaign, idx) => (
            <RecentCampaignRow
              key={campaign.id}
              campaign={campaign}
              index={idx}
              onNavigate={onRowNavigate}
            />
          ))
        )}
      </div>
    </Card>
  );
}
