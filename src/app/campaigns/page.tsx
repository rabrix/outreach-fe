"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCampaigns, useCreateCampaign, useLaunchCampaign } from "@/features/campaigns/hooks";
import type { Campaign } from "@/features/campaigns/calls";
import { useQueryClient } from "@tanstack/react-query";
import { useAllLeadLists } from "@/features/leads/hooks";
import { useGmailAccounts } from "@/features/gmail/hooks";
import { CampaignCard, CreateCampaignModal, DashboardLayout, Spinner } from "@/components";
import { Plus, Search, Filter } from "lucide-react";
import { toast } from "react-toastify";

export default function CampaignsPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";
  const queryClient = useQueryClient();
  const { data, isLoading } = useCampaigns(userId);
  const { data: leadListsData } = useAllLeadLists();
  const { data: gmailAccountsData } = useGmailAccounts(userId);
  const createCampaignMutation = useCreateCampaign();
  const launchCampaignMutation = useLaunchCampaign();

  const [createOpen, setCreateOpen] = useState(false);

  const campaigns = data?.success ? data.campaigns : [];
  const leadLists = leadListsData?.leadLists ?? [];
  const gmailAccounts = gmailAccountsData?.accounts ?? [];

  const handleLaunchCampaign = (campaign: Campaign) => {
    if (campaign.status === "running") {
      toast.info("Campaign is already running");
      return;
    }
    if (!campaign.leadListId) {
      toast.error("This campaign has no lead list. Assign a list before launching.");
      return;
    }

    launchCampaignMutation.mutate(
      { id: campaign.id, data: { leadListId: campaign.leadListId } },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Campaign launched successfully!");
          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to launch campaign");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and monitor your automated outreach campaigns.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            <span>New Campaign</span>
          </button>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-2 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full border-none bg-transparent py-2 pl-10 pr-4 text-sm focus:ring-0"
            />
          </div>
          <button type="button" className="rounded-lg p-2 transition-colors hover:bg-secondary">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="grid gap-4">
          {campaigns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card py-12 text-center">
              <p className="text-muted-foreground">No campaigns found. Create your first one!</p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onLaunch={handleLaunchCampaign}
                launchPending={launchCampaignMutation.isPending}
                leadList={leadLists.find((list) => list.id === campaign.leadListId)}
              />
            ))
          )}
        </div>
      </div>

      <CreateCampaignModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        userId={userId}
        leadLists={leadLists}
        gmailAccounts={gmailAccounts}
        isSubmitting={createCampaignMutation.isPending}
        onSubmit={(payload) => {
          createCampaignMutation.mutate(payload, {
            onSuccess: () => {
              toast.success("Campaign created successfully!");
              setCreateOpen(false);
            },
            onError: (err: Error) => {
              toast.error(err.message || "Failed to create campaign");
            },
          });
        }}
      />
    </DashboardLayout>
  );
}
