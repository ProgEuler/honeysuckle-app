import { getReport } from "@/lib/api/report";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const reportQueryKey = ["dailycheck", "report"] as const;

export const useReportQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: reportQueryKey,
    queryFn: getReport,
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60,
    retry: 1,
  });
};
