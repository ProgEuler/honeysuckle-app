import { getInsights } from "@/lib/api/insights";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const insightsQueryKey = ["analytics", "insights"] as const;

export const useInsightsQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: insightsQueryKey,
    queryFn: getInsights,
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60,
    retry: 1,
  });
};
