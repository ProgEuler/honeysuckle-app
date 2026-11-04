import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import * as Haptics from "expo-haptics";
import type { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  value: number | null;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  /** Shown next to the title once a value is picked, e.g. an icon + word. */
  summary?: ReactNode;
};

const VALUES = Array.from({ length: 11 }, (_, i) => i);

/** A 0–10 scale of tappable steps: faster than a slider and easy to hit. */
export default function RatingScale({ title, value, onChange, lowLabel, highLabel, summary }: Props) {
  const handlePress = (next: number) => {
    Haptics.selectionAsync().catch(() => {});
    onChange(next);
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <RNText variant="header" size="lg" style={styles.title}>
          {title}
        </RNText>
        {value !== null && (
          <View style={styles.summary}>
            {summary}
            <RNText variant="title" size="lg" style={styles.valueText}>
              {value}/10
            </RNText>
          </View>
        )}
      </View>

      <View style={styles.scale} accessibilityRole="adjustable" accessibilityLabel={title}>
        {VALUES.map((step) => {
          const isActive = value === step;
          return (
            <TouchableOpacity
              key={step}
              onPress={() => handlePress(step)}
              style={[styles.step, isActive && styles.stepActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: isActive }}
              accessibilityLabel={`${step} out of 10`}
              hitSlop={{ top: 8, bottom: 8 }}
            >
              <RNText variant="header" size="sm" style={[styles.stepText, isActive && styles.stepTextActive]}>
                {step}
              </RNText>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.endLabels}>
        <RNText variant="medium" size="xs" style={styles.endLabel}>
          {lowLabel}
        </RNText>
        <RNText variant="medium" size="xs" style={styles.endLabel}>
          {highLabel}
        </RNText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 32,
  },
  title: { flexShrink: 1 },
  summary: { flexDirection: "row", alignItems: "center", gap: 8 },
  valueText: { color: Colors.green },
  scale: {
    flexDirection: "row",
    gap: 4,
  },
  step: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CFD9B5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  stepActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  stepText: { color: "#8F8985", fontSize: 13 },
  stepTextActive: { color: Colors.white },
  endLabels: { flexDirection: "row", justifyContent: "space-between" },
  endLabel: { color: "#A09791" },
});
