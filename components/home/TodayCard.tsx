import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { moodForRating, moodOptions } from "@/constants/moodOptions";
import { useQuestionnaires } from "@/hooks/useQuestionnaires";
import { useAuthStore } from "@/store/useAuthStore";
import { getJournalEntries } from "@/lib/api/checkin";
import { useQuery } from "@tanstack/react-query";
import { router, type Href } from "expo-router";
import { ArrowRight, ClipboardList } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const LABEL_TO_MOOD: Record<string, number> = { excellent: 0, good: 1, neutral: 2, sad: 3, depressed: 4 };

const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

/** Home's "at a glance": today's check-in and anything that's due. */
export default function TodayCard() {
  const accessToken = useAuthStore((state) => state.accessToken);
  // Under the "journal-entries" key so saving a check-in refreshes it too.
  const { data } = useQuery({
    queryKey: ["journal-entries", "latest"],
    queryFn: () => getJournalEntries({ page: 1, page_size: 1 }),
    enabled: Boolean(accessToken),
  });
  const { data: questionnaires } = useQuestionnaires();

  const latest = data?.results?.[0];
  const latestAt = latest ? new Date(latest.created_at ?? latest.time) : null;
  const checkedInToday = latestAt ? isToday(latestAt) : false;
  const mood =
    latest?.mood_rating != null
      ? moodForRating(latest.mood_rating)
      : latest
        ? moodOptions[LABEL_TO_MOOD[latest.assesment?.toLowerCase()] ?? 2]
        : null;
  const MoodIcon = mood?.icon;
  const due = questionnaires?.filter((q) => q.is_due) ?? [];

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <RNText variant="medium" size="sm" style={styles.eyebrow}>
          Today
        </RNText>
        {checkedInToday && latestAt && mood && MoodIcon ? (
          <View style={styles.row}>
            <MoodIcon width={40} height={40} />
            <View style={{ flex: 1 }}>
              <RNText variant="title" size="lg">
                Feeling {mood.label.toLowerCase()}
                {latest?.mood_rating != null ? ` · ${latest.mood_rating}/10` : ""}
              </RNText>
              <RNText variant="medium" size="sm" style={styles.muted}>
                Checked in at {latestAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </RNText>
            </View>
          </View>
        ) : (
          <View style={{ gap: 2 }}>
            <RNText variant="title" size="lg">
              How are you right now?
            </RNText>
            <RNText variant="medium" size="sm" style={styles.muted}>
              You haven't checked in today. It takes about 15 seconds.
            </RNText>
          </View>
        )}
        <TouchableOpacity
          style={[styles.button, checkedInToday && styles.buttonSecondary]}
          onPress={() => router.push("/(tabs)/dailycheck")}
          accessibilityRole="button"
        >
          <RNText variant="header" size="md" style={{ color: checkedInToday ? Colors.brown : Colors.white }}>
            {checkedInToday ? "Check in again" : "Check in now"}
          </RNText>
          <ArrowRight size={18} color={checkedInToday ? Colors.brown : Colors.white} />
        </TouchableOpacity>
      </View>

      {due.map((q) => (
        <TouchableOpacity
          key={q.key}
          style={styles.due}
          onPress={() => router.push(`/assessments/${q.key}` as Href)}
          accessibilityRole="button"
        >
          <ClipboardList size={20} color={Colors.orange} />
          <RNText variant="medium" size="sm" style={{ flex: 1, color: Colors.brown }}>
            {q.name} is due
          </RNText>
          <RNText variant="header" size="sm" style={{ color: Colors.orange }}>
            Take it
          </RNText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  card: { backgroundColor: Colors.white, borderRadius: 24, padding: 18, gap: 14 },
  eyebrow: { color: Colors.green, textTransform: "uppercase", letterSpacing: 0.5 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  muted: { color: Colors.primaryText },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: Colors.brown,
  },
  buttonSecondary: { backgroundColor: "#F3EFEC" },
  due: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF1EA",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
