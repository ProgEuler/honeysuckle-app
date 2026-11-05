import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useQuestionnaires } from "@/hooks/useQuestionnaires";
import type { QuestionnaireSummary } from "@/lib/api/questionnaires";
import { router, type Href } from "expo-router";
import { ChevronRight, ClipboardList } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const DAY_MS = 24 * 60 * 60 * 1000;

const statusText = (item: QuestionnaireSummary) => {
  if (item.is_due) return item.last_completed_at ? "Due again" : "Not taken yet";
  if (!item.next_due_at) return "Take any time";
  const days = Math.max(1, Math.ceil((new Date(item.next_due_at).getTime() - Date.now()) / DAY_MS));
  return `Next in ${days} day${days === 1 ? "" : "s"}`;
};

/** Standalone questionnaires (PHQ-9, GAD-7, …), with the due ones first. */
export default function QuestionnaireList() {
  const { data } = useQuestionnaires();
  if (!data?.length) return null;

  const items = [...data].sort((a, b) => Number(b.is_due) - Number(a.is_due));

  return (
    <View style={styles.container}>
      <RNText variant="header" size="lg">
        Questionnaires
      </RNText>
      <RNText variant="medium" size="sm" style={styles.muted}>
        A short check every couple of weeks shows how you're doing over time.
      </RNText>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          onPress={() => router.push(`/assessments/${item.key}` as Href)}
          style={styles.card}
          accessibilityRole="button"
        >
          <View style={styles.icon}>
            <ClipboardList size={22} color={Colors.green} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <RNText variant="header" size="md">
              {item.name}
            </RNText>
            <RNText variant="medium" size="sm" style={styles.muted}>
              {statusText(item)}
            </RNText>
          </View>
          {item.is_due && (
            <View style={styles.dueBadge}>
              <RNText variant="header" size="xs" style={{ color: Colors.white }}>
                Due
              </RNText>
            </View>
          )}
          <ChevronRight size={20} color="#A09791" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  muted: { color: "#8F8985" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F2F5EB",
    alignItems: "center",
    justifyContent: "center",
  },
  dueBadge: {
    backgroundColor: Colors.orange,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
