import { apiClient } from "@/lib/apiClient";

// Interfaces and Types
export interface CreateCampaignRequest {
  name: string;
  gmailAccountIds: string[];
  userId: string;
  leadListId: string;
}

export interface CreateCampaignResponse {
  success: true;
  message: "Campaign created successfully as DRAFT.";
  campaignId: string;
}

export interface LaunchCampaignRequest {
  leadListId: string;
}

export interface LaunchCampaignResponse {
  success: true;
  message: string;
  campaignId: string;
}

export interface CampaignStepStatus {
  dominantStep: number | null;
  byStep: { step: number; leadCount: number }[];
  enrolledLeads: number;
}

export interface CampaignStats {
  emailsSent: number;
  replies: number;
  currentStepStatus: CampaignStepStatus;
  lastSentAt: string | null;
  followupCounts: number;
  sentCount: number;
  totalReplies: number;
  totalLeads: number;
}

export interface CampaignListStats {
  emailsSent: number;
  replies: number;
  currentStepStatus: CampaignStepStatus;
  lastSentAt: string | null;
}

export interface CampaignStep {
  id: string;
  campaignId: string;
  stepOrder: number;
  subject: string;
  content: string;
  delayDays: number;
  createdAt: string;
}

export interface CampaignGmailAccount {
  id: string;
  emailAddress: string;
  userId: string;
  isActive: boolean;
}

export interface GetStatsResponse {
  success: true;
  stats: CampaignStats;
}

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  leadListId: string | null;
  status: "draft" | "running" | "paused" | "completed";
  createdAt: string;
  updatedAt: string;
  gmailAccounts: CampaignGmailAccount[];
  steps: CampaignStep[];
  stats: CampaignListStats;
}

export interface GetAllCampaignsResponse {
  success: true;
  campaigns: Campaign[];
}

// API Calls
export const getAllCampaigns = async (userId: string): Promise<GetAllCampaignsResponse> => {
  return apiClient<GetAllCampaignsResponse>(`/campaigns?userId=${encodeURIComponent(userId)}`, {
    method: "GET",
  });
};

export const createCampaign = async (data: CreateCampaignRequest): Promise<CreateCampaignResponse> => {
  return apiClient<CreateCampaignResponse>("/campaigns/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const launchCampaign = async (
  id: string,
  data: LaunchCampaignRequest
): Promise<LaunchCampaignResponse> => {
  return apiClient<LaunchCampaignResponse>(`/campaigns/${id}/launch`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getCampaignStats = async (id: string): Promise<GetStatsResponse> => {
  return apiClient<GetStatsResponse>(`/campaigns/${encodeURIComponent(id)}/stats`, {
    method: "GET",
  });
};
