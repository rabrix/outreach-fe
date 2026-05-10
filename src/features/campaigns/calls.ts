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

export interface GetStatsResponse {
  success: true;
  stats: {
    totalLeads: number;
    sentCount: number;
    totalReplies: number;
    followupCounts: number;
  };
}

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  status: "draft" | "running" | "paused" | "completed";
  gmailAccounts: {
    id: string;
    emailAddress: string;
    isActive: boolean;
  }[];
  leadListId?: string; // Added to support "View Leads"
  createdAt: string;
  updatedAt: string;
}

export interface GetAllCampaignsResponse {
  success: true;
  campaigns: Campaign[];
}

// API Calls
export const getAllCampaigns = async (userId: string): Promise<GetAllCampaignsResponse> => {
  return apiClient<GetAllCampaignsResponse>(`/campaigns?userId=${userId}`, {
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
  return apiClient<GetStatsResponse>(`/campaigns/${id}/stats`, {
    method: "GET",
  });
};
