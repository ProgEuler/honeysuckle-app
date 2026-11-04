import { createCheckin } from "@/lib/api/checkin";
import { ApiError } from "@/lib/api/client";
import { useCheckinStore } from "@/store/useCheckinStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "sonner-native";

/** Saves a quick or detailed check-in and refreshes everything it affects. */
export const useSaveCheckin = () => {
  const queryClient = useQueryClient();
  const resetCheckin = useCheckinStore((state) => state.resetCheckin);

  return useMutation({
    mutationFn: createCheckin,
    onSuccess: () => {
      // The check-in affects multiple downstream views:
      // - Journal History list (new entry at the top)
      // - Analytics insights (mood distribution, totals)
      // - Performance report (streak, top emotions, stats)
      // - `me` (total_checkin, streak) shown on Home
      // - Notifications badge if unread counters change
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "insights"] });
      queryClient.invalidateQueries({ queryKey: ["dailycheck", "report"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      toast.success("Check-in saved successfully.");
      resetCheckin();
      router.push("/dailycheck-sub-screens/performance");
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to save check-in right now.";

      toast.error(message);
    },
  });
};
