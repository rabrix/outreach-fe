"use client";

import { Mail, Play, Pause, MoreVertical, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Campaign } from "@/features/campaigns/calls";
import { getCampaignListMetrics } from "@/features/campaigns/listMetrics";
import { Card, CardContent } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Spinner } from "@/components/ui/Spinner";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { CampaignStatCell } from "./CampaignStatCell";

type CampaignCardProps = {
  campaign: Campaign;
  onLaunch: (campaign: Campaign) => void;
  launchPending: boolean;
};

export function CampaignCard({ campaign, onLaunch, launchPending }: CampaignCardProps) {
  const router = useRouter();
  const m = getCampaignListMetrics(campaign);

  return (
    <Card className="group hover:shadow-xl hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-0">
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Mail className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                {campaign.name}
              </h3>
              <CampaignStatusBadge status={campaign.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated {new Date(campaign.updatedAt).toLocaleDateString()}
              {m.stepCount > 0 ? ` · ${m.stepCount} step${m.stepCount === 1 ? "" : "s"}` : ""}
              {m.gmailCount > 0 ? ` · ${m.gmailCount} inbox${m.gmailCount === 1 ? "" : "es"}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onLaunch(campaign)}
              disabled={launchPending}
              className="p-2 hover:bg-secondary rounded-xl transition-all disabled:opacity-50"
            >
              {launchPending ? (
                <Spinner size="sm" />
              ) : campaign.status === "running" ? (
                <Pause className="w-5 h-5 text-emerald-500" />
              ) : (
                <Play className="w-5 h-5 text-primary" />
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="p-2 hover:bg-secondary rounded-xl transition-all">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {campaign.leadListId ? (
                  <DropdownMenuItem
                    onClick={() => router.push(`/prospects?listId=${campaign.leadListId}`)}
                    className="cursor-pointer"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Leads
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Campaign Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 pb-6 pt-0 border-t border-border/60">
          <CampaignStatCell label="Enrolled" value={m.enrolled.toLocaleString()} />
          <CampaignStatCell label="Emails sent" value={m.sent.toLocaleString()} />
          <CampaignStatCell label="Replies" value={m.replies.toLocaleString()} />
          <CampaignStatCell label="Reply rate" value={`${m.replyPct}%`} />
          <div className="col-span-2 sm:col-span-4 rounded-xl bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Last sent:</span> {m.lastSent}
            {m.dominantStep != null ? (
              <span className="ml-3">
                <span className="font-semibold text-foreground">Dominant step:</span> {m.dominantStep}
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
