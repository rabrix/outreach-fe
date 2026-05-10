import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./calls";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  byUser: (userId: string) => [...dashboardKeys.all, userId] as const,
};

export const useDashboard = (userId: string) => {
  return useQuery({
    queryKey: dashboardKeys.byUser(userId),
    queryFn: () => getDashboard(userId),
    enabled: !!userId,
  });
};
