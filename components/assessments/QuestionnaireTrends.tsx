import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useQuestionnaireTrends } from "@/hooks/useQuestionnaires";
import type { QuestionnaireTrend } from "@/lib/api/questionnaires";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// Lower is better on PHQ-9 / GAD-7.
const changeText = (latest: number, previous: number) => {
  const diff = latest - previous;
  if (diff === 0) return "Same as last time";
  return `${Math.abs(diff)} ${diff < 0 ? "lower" : "higher"} than last time`;
};

const TrendCard = ({ trend }: { trend: QuestionnaireTrend }) => {
  const [width, setWidth] = useState(0);
  const scored = trend.results.filter(
    (r): r is typeof r & { total_score: number } => r.total_score !== null,
  );
  const latest = scored[scored.length - 1];
  const previous = scored[scored.length - 2];
  const open = () => router.push(`/assessments/${trend.key}` as Href);

  if (!latest) {
    return (
      <TouchableOpacity style={styles.card} onPress={open} accessibilityRole="button">
        <RNText variant="header" size="md">
          {trend.name}
        </RNText>
        <RNText variant="medium" size="sm" style={styles.muted}>
          Not taken yet. Tap to take it; your scores will show here over time.
        </RNText>
      </TouchableOpacity>
    );
  }

  const chartWidth = Math.max(0, width - 60);
  const spacing = scored.length > 1 ? Math.max(24, chartWidth / (scored.length - 1)) : 0;

  return (
    <View
      style={styles.card}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.headerRow}>
        <RNText variant="header" size="md" style={{ flexShrink: 1 }}>
          {trend.name}
        </RNText>
        {!!latest.severity && (
          <View style={styles.pill}>
            <RNText variant="header" size="xs" style={{ color: Colors.brown }}>
              {latest.severity}
            </RNText>
          </View>
        )}
      </View>
      <RNText variant="title" size="2xl">
        {latest.total_score}
        <RNText variant="medium" size="md" style={styles.muted}>
          {" "}/ {trend.max_score} · {formatShortDate(latest.created_at)}
        </RNText>
      </RNText>
      <RNText variant="medium" size="sm" style={styles.muted}>
        {previous
          ? changeText(latest.total_score, previous.total_score)
          : "Take it again in a couple of weeks to see your trend."}
      </RNText>

      {scored.length > 1 && chartWidth > 0 && (
        <LineChart
          data={scored.map((r) => ({ value: r.total_score, label: formatShortDate(r.created_at) }))}
          maxValue={trend.max_score || undefined}
          noOfSections={3}
          height={120}
          width={chartWidth}
          spacing={spacing}
          initialSpacing={8}
          endSpacing={8}
          color={Colors.green}
          thickness={2}
          dataPointsColor={Colors.green}
          hideRules
          yAxisColor="#E8DDD9"
          xAxisColor="#E8DDD9"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          yAxisLabelWidth={28}
          disableScroll
        />
      )}

      <TouchableOpacity onPress={open} style={styles.retake}>
        <RNText variant="subtitle" size="sm" style={{ color: Colors.green }}>
          Take it again
        </RNText>
      </TouchableOpacity>
    </View>
  );
};

/** PHQ-9 / GAD-7 (and any other scored questionnaire) results over time. */
export default function QuestionnaireTrends() {
  const { data } = useQuestionnaireTrends();
  if (!data?.length) return null;

  return (
    <View style={styles.container}>
      <RNText variant="title" size="xl">
        Questionnaire trends
      </RNText>
      <RNText variant="medium" size="sm" style={styles.muted}>
        Your scores over the last 6 months. Lower scores mean fewer symptoms. These are screening
        results, not a diagnosis.
      </RNText>
      {data.map((trend) => (
        <TrendCard key={trend.key} trend={trend} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  muted: { color: "#8F8985" },
  card: { backgroundColor: Colors.white, borderRadius: 24, padding: 18, gap: 8, overflow: "hidden" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  pill: { backgroundColor: "#E8DDD9", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  axisText: { color: "#A09791", fontSize: 10 },
  retake: { alignSelf: "flex-start", paddingVertical: 4 },
});
