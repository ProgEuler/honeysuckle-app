import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { StyleSheet, View } from "react-native";

type Factor = { factor: string; count: number };

/** The things the user said were affecting their mood most often. */
export default function TopFactors({ factors }: { factors: Factor[] }) {
  if (!factors.length) return null;
  const max = factors[0].count;

  return (
    <View style={styles.card}>
      <RNText variant="header" size="lg">
        What's been affecting you
      </RNText>
      {factors.map(({ factor, count }) => (
        <View key={factor} style={styles.row}>
          <View style={styles.labelRow}>
            <RNText variant="medium" size="sm" style={{ color: Colors.brown }}>
              {factor}
            </RNText>
            <RNText variant="medium" size="sm" style={styles.muted}>
              {count} {count === 1 ? "time" : "times"}
            </RNText>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(count / max) * 100}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 12 },
  row: { gap: 6 },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
  muted: { color: "#8F8985" },
  track: { height: 8, borderRadius: 4, backgroundColor: "#F3EFEC", overflow: "hidden" },
  fill: { height: 8, borderRadius: 4, backgroundColor: Colors.green },
});
