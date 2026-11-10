import { createCheckin, type JournalEntry } from "@/lib/api/checkin";
import { ApiError } from "@/lib/api/client";
import { setLastSavedCheckin } from "@/lib/lastCheckin";
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
    onSuccess: (saved) => {
      // The check-in affects multiple downstream views:
      // - Journal History list (new entry at the top)
      // - Analytics insights (mood distribution, totals)
      // - `me` (total_checkin, streak) shown on Home
      // - Notifications badge if unread counters change
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "insights"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // The server returns the saved check-in; the summary screen shows it.
      setLastSavedCheckin(saved as unknown as JournalEntry);
      resetCheckin();
      router.push("/dailycheck-sub-screens/saved");
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
