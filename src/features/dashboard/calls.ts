import { apiClient } from "@/lib/apiClient";

export interface DashboardMetricWithChange {
  value: number;
  changePercent: number;
  comparison: string;
}

export interface DashboardAverageReplyRate {
  percent: number;
  lastWeekPercent: number;
}

export interface DashboardPayload {
  activeCampaigns: DashboardMetricWithChange;
  totalProspects: DashboardMetricWithChange;
  emailsSent: DashboardMetricWithChange;
  averageReplyRate: DashboardAverageReplyRate;
}

export interface GetDashboardResponse {
  success: true;
  dashboard: DashboardPayload;
}

export const getDashboard = async (userId: string): Promise<GetDashboardResponse> => {
  return apiClient<GetDashboardResponse>(`/dashboard?userId=${encodeURIComponent(userId)}`, {
    method: "GET",
  });
};
