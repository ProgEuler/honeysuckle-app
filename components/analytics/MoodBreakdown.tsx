import Depressed from "@/assets/svgs/depressed.svg";
import Excellent from "@/assets/svgs/excellent.svg";
import Happy from "@/assets/svgs/happy.svg";
import Neutral from "@/assets/svgs/neutral.svg";
import Sad from "@/assets/svgs/sad.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import type { InsightSummary } from "@/lib/api/insights";
import { StyleSheet, View } from "react-native";

const MOODS = [
  { key: "excellent", label: "Excellent", icon: Excellent, color: Colors.green },
  { key: "good", label: "Good", icon: Happy, color: "#FFCE5C" },
  { key: "neutral", label: "Neutral", icon: Neutral, color: "#BDA193" },
  { key: "sad", label: "Sad", icon: Sad, color: "#FE814B" },
  { key: "depressed", label: "Depressed", icon: Depressed, color: "#A18FFF" },
];

/** How often each mood came up this month, best to worst. */
export default function MoodBreakdown({ summary }: { summary: InsightSummary[] }) {
  const byKey = Object.fromEntries(summary.map((s) => [s.assesment, s]));

  return (
    <View style={styles.card}>
      <RNText variant="header" size="lg">
        Moods this month
      </RNText>
      {MOODS.map(({ key, label, icon: Icon, color }) => {
        const item = byKey[key];
        const percentage = item?.percentage ?? 0;
        return (
          <View key={key} style={styles.row}>
            <Icon width={24} height={24} />
            <RNText variant="medium" size="sm" style={styles.label}>
              {label}
            </RNText>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
            <RNText variant="medium" size="sm" style={styles.percent}>
              {Math.round(percentage)}%
            </RNText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { width: 72, color: Colors.brown },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: "#F3EFEC", overflow: "hidden" },
  fill: { height: 8, borderRadius: 4 },
  percent: { width: 38, textAlign: "right", color: "#8F8985" },
});
