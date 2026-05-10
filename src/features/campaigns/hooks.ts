import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCampaigns,
  createCampaign,
  launchCampaign,
  getCampaignStats,
  CreateCampaignRequest,
  LaunchCampaignRequest,
  GetAllCampaignsResponse,
} from "./calls";

function sortCampaignsByCreatedAtDesc(
  campaigns: GetAllCampaignsResponse["campaigns"]
): GetAllCampaignsResponse["campaigns"] {
  return [...campaigns].sort((a, b) => {
    const tb = new Date(b.createdAt).getTime();
    const ta = new Date(a.createdAt).getTime();
    const nb = Number.isFinite(tb) ? tb : 0;
    const na = Number.isFinite(ta) ? ta : 0;
    return nb - na;
  });
}

// Query Keys
export const campaignKeys = {
  all: ["campaigns"] as const,
  list: (userId: string) => [...campaignKeys.all, "list", userId] as const,
  stats: (id: string) => [...campaignKeys.all, "stats", id] as const,
};

export const useCampaigns = (userId: string) => {
  return useQuery({
    queryKey: campaignKeys.list(userId),
    queryFn: () => getAllCampaigns(userId),
    enabled: !!userId,
    select: (data: GetAllCampaignsResponse) =>
      data.success
        ? { ...data, campaigns: sortCampaignsByCreatedAtDesc(data.campaigns) }
        : data,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => createCampaign(data),
    onSuccess: () => {
      // Invalidate relevant queries if any (e.g., a list of campaigns)
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
};

export const useLaunchCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LaunchCampaignRequest }) =>
      launchCampaign(id, data),
    onSuccess: (_, variables) => {
      // Invalidate stats for this campaign
      queryClient.invalidateQueries({
        queryKey: campaignKeys.stats(variables.id),
      });
    },
  });
};

export const useCampaignStats = (id: string) => {
  return useQuery({
    queryKey: campaignKeys.stats(id),
    queryFn: () => getCampaignStats(id),
    enabled: !!id,
  });
};
