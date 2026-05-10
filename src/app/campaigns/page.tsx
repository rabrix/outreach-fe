"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useCampaigns, useCreateCampaign, useLaunchCampaign } from "@/features/campaigns/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useAllLeadLists } from "@/features/leads/hooks";
import { useGmailAccounts } from "@/features/gmail/hooks";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import {
  Plus, Mail, Play, Pause, MoreVertical, Search, Filter, Users, Settings,
  CheckCircle2, AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { toast } from "react-toastify";

export default function CampaignsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useCampaigns(user?.id || "");
  const { data: leadListsData } = useAllLeadLists();
  const { data: gmailAccountsData } = useGmailAccounts(user?.id || "");
  const createCampaignMutation = useCreateCampaign();
  const launchCampaignMutation = useLaunchCampaign();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampaignData, setNewCampaignData] = useState({
    name: "",
    leadListId: "",
    gmailAccountIds: [] as string[],
  });

  const campaigns = data?.success ? data.campaigns : [];
  const leadLists = leadListsData?.leadLists || [];
  const gmailAccounts = gmailAccountsData?.accounts || [];

  const handleCreateCampaign = () => {
    if (!newCampaignData.name.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }
    if (!newCampaignData.leadListId) {
      toast.error("Please select a lead list");
      return;
    }
    if (newCampaignData.gmailAccountIds.length === 0) {
      toast.error("Please select at least one Gmail account");
      return;
    }

    createCampaignMutation.mutate(
      {
        name: newCampaignData.name,
        leadListId: newCampaignData.leadListId,
        gmailAccountIds: newCampaignData.gmailAccountIds,
        userId: user?.id || "",
      },
      {
        onSuccess: () => {
          toast.success("Campaign created successfully!");
          setIsCreateModalOpen(false);
          setNewCampaignData({ name: "", leadListId: "", gmailAccountIds: [] });
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to create campaign");
        },
      }
    );
  };

  const toggleGmailAccount = (id: string) => {
    setNewCampaignData(prev => ({
      ...prev,
      gmailAccountIds: prev.gmailAccountIds.includes(id)
        ? prev.gmailAccountIds.filter(accountId => accountId !== id)
        : [...prev.gmailAccountIds, id]
    }));
  };

  const handleLaunchCampaign = (campaign: any) => {
    if (campaign.status === "running") {
      toast.info("Campaign is already running");
      return;
    }

    launchCampaignMutation.mutate(
      { id: campaign.id, data: { leadListId: campaign.leadListId } },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Campaign launched successfully!");
          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to launch campaign");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your automated outreach campaigns.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>New Campaign</span>
          </button>
        </div>

        <div className="flex items-center gap-4 bg-card/50 p-2 rounded-2xl border border-border/50 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full bg-transparent border-none focus:ring-0 pl-10 pr-4 py-2 text-sm"
            />
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="grid gap-4">
          {campaigns?.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No campaigns found. Create your first one!</p>
            </div>
          ) : (
            campaigns?.map((campaign) => (
              <Card key={campaign.id} className="group hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Mail className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                          {campaign.name}
                        </h3>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${campaign.status === "running" ? "bg-emerald-500/10 text-emerald-500" :
                          campaign.status === "paused" ? "bg-amber-500/10 text-amber-500" :
                            "bg-secondary text-muted-foreground"
                          }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last updated {new Date(campaign.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleLaunchCampaign(campaign)}
                        disabled={launchCampaignMutation.isPending}
                        className="p-2 hover:bg-secondary rounded-xl transition-all disabled:opacity-50"
                      >
                        {launchCampaignMutation.isPending ? (
                           <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : campaign.status === "running" ? (
                          <Pause className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Play className="w-5 h-5 text-primary" />
                        )}
                      </button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-secondary rounded-xl transition-all">
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {campaign.leadListId && (
                            <DropdownMenuItem
                              onClick={() => router.push(`/prospects?listId=${campaign.leadListId}`)}
                              className="cursor-pointer"
                            >
                              <Users className="w-4 h-4 mr-2" />
                              View Leads
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Campaign Settings
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Create New Campaign"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">Campaign Name</label>
            <input 
              type="text"
              placeholder="e.g., Summer Outreach 2024"
              value={newCampaignData.name}
              onChange={(e) => setNewCampaignData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Select Lead List</label>
            <select 
              value={newCampaignData.leadListId}
              onChange={(e) => setNewCampaignData(prev => ({ ...prev, leadListId: e.target.value }))}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            >
              <option value="">Choose a list...</option>
              {leadLists.map(list => (
                <option key={list.id} value={list.id}>{list.name} ({list.leadCount || 0} leads)</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Select Gmail Accounts</label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {gmailAccounts.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 italic">No Gmail accounts connected. Go to settings to connect one.</p>
              ) : (
                gmailAccounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => toggleGmailAccount(account.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                      newCampaignData.gmailAccountIds.includes(account.id)
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">{account.emailAddress}</span>
                    </div>
                    {newCampaignData.gmailAccountIds.includes(account.id) && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateCampaign}
              disabled={createCampaignMutation.isPending}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createCampaignMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
