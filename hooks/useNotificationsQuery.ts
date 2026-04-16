import { getNotifications } from "@/lib/api/notifications";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const notificationsQueryKey = ["notifications"] as const;

export const useNotificationsQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: notificationsQueryKey,
    queryFn: getNotifications,
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 2,
  });
};
