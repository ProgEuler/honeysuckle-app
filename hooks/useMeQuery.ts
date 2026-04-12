import { getMe } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const meQueryKey = ["auth", "me"] as const;

export const useMeQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const persistedUser = useAuthStore((state) => state.user);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  const query = useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    initialData: persistedUser ?? undefined,
  });

  useEffect(() => {
    if (query.data) {
      setUserProfile(query.data);
    }
  }, [query.data, setUserProfile]);

  return query;
};
