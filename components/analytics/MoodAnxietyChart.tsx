import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import type { InsightDay } from "@/lib/api/insights";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const dayLabel = (iso: string) => String(Number(iso.slice(8, 10)));

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <RNText variant="medium" size="xs" style={styles.muted}>
      {label}
    </RNText>
  </View>
);

/** Daily average mood and anxiety (0–10) for the month. */
export default function MoodAnxietyChart({ days }: { days: InsightDay[] }) {
  const [width, setWidth] = useState(0);
  const points = days.filter((d) => d.mood !== null);
  // Anxiety only exists on newer check-ins; draw it when every day has it,
  // rather than inventing values for the gaps.
  const showAnxiety = points.length > 0 && points.every((d) => d.anxiety !== null);

  const chartWidth = Math.max(0, width - 56);
  const spacing = points.length > 1 ? Math.max(18, chartWidth / (points.length - 1)) : 0;
  // Label at most ~6 days so the axis stays readable.
  const labelEvery = Math.max(1, Math.ceil(points.length / 6));

  return (
    <View style={styles.card} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View style={styles.header}>
        <RNText variant="header" size="lg">
          Mood & anxiety
        </RNText>
        <View style={styles.legend}>
          <LegendDot color={Colors.green} label="Mood" />
          {showAnxiety && <LegendDot color={Colors.orange} label="Anxiety" />}
        </View>
      </View>

      {points.length < 2 ? (
        <RNText variant="medium" size="sm" style={styles.muted}>
          Check in on a few more days to see how things change.
        </RNText>
      ) : (
        chartWidth > 0 && (
          <LineChart
            data={points.map((d, i) => ({
              value: d.mood ?? 0,
              label: i % labelEvery === 0 ? dayLabel(d.date) : "",
            }))}
            data2={showAnxiety ? points.map((d) => ({ value: d.anxiety ?? 0 })) : undefined}
            maxValue={10}
            noOfSections={2}
            height={140}
            width={chartWidth}
            spacing={spacing}
            initialSpacing={6}
            endSpacing={6}
            color1={Colors.green}
            color2={Colors.orange}
            dataPointsColor1={Colors.green}
            dataPointsColor2={Colors.orange}
            dataPointsRadius={3}
            thickness={2}
            curved
            rulesColor="#F0EBE7"
            rulesType="solid"
            yAxisColor="transparent"
            xAxisColor="#E8DDD9"
            yAxisTextStyle={styles.axis}
            xAxisLabelTextStyle={styles.axis}
            yAxisLabelWidth={22}
            disableScroll
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 14, overflow: "hidden" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  legend: { flexDirection: "row", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  muted: { color: "#8F8985" },
  axis: { color: "#A09791", fontSize: 10 },
});
