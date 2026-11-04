import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import type { SleepQuality } from "@/store/useCheckinStore";
import * as Haptics from "expo-haptics";
import { Minus, Plus } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const QUALITY_OPTIONS: { value: SleepQuality; label: string }[] = [
  { value: "poor", label: "Poor" },
  { value: "okay", label: "Okay" },
  { value: "good", label: "Good" },
  { value: "great", label: "Great" },
];

// Most people sleep around here; the first tap on +/- starts from it.
const DEFAULT_HOURS = 7;
const MIN_HOURS = 0;
const MAX_HOURS = 16;

type Props = {
  hours: number | null;
  quality: SleepQuality | null;
  onHoursChange: (hours: number) => void;
  onQualityChange: (quality: SleepQuality) => void;
};

export default function SleepInput({ hours, quality, onHoursChange, onQualityChange }: Props) {
  const step = (delta: number) => {
    Haptics.selectionAsync().catch(() => {});
    const base = hours ?? DEFAULT_HOURS - delta;
    onHoursChange(Math.min(MAX_HOURS, Math.max(MIN_HOURS, base + delta)));
  };

  const formatHours = (value: number) => {
    const whole = Math.floor(value);
    return value % 1 ? `${whole}h 30m` : `${whole}h`;
  };

  return (
    <View style={styles.card}>
      <RNText variant="header" size="lg">
        How did you sleep last night?
      </RNText>

      <View style={styles.stepperRow}>
        <TouchableOpacity
          onPress={() => step(-0.5)}
          disabled={hours === MIN_HOURS}
          style={[styles.stepButton, hours === MIN_HOURS && styles.disabled]}
          accessibilityLabel="Less sleep"
        >
          <Minus size={20} color={Colors.brown} />
        </TouchableOpacity>
        <View style={styles.hoursBox} accessibilityLiveRegion="polite">
          <RNText variant="title" size="2xl" style={{ color: hours === null ? "#A09791" : Colors.brown }}>
            {hours === null ? "--" : formatHours(hours)}
          </RNText>
          <RNText variant="medium" size="xs" style={styles.hoursCaption}>
            hours slept
          </RNText>
        </View>
        <TouchableOpacity
          onPress={() => step(0.5)}
          disabled={hours === MAX_HOURS}
          style={[styles.stepButton, hours === MAX_HOURS && styles.disabled]}
          accessibilityLabel="More sleep"
        >
          <Plus size={20} color={Colors.brown} />
        </TouchableOpacity>
      </View>

      <View style={styles.qualityRow}>
        {QUALITY_OPTIONS.map((option) => {
          const isActive = quality === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onQualityChange(option.value)}
              style={[styles.chip, isActive && styles.chipActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: isActive }}
            >
              <RNText variant="medium" size="sm" style={[styles.chipText, isActive && styles.chipTextActive]}>
                {option.label}
              </RNText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E8DDD9",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.35 },
  hoursBox: { alignItems: "center" },
  hoursCaption: { color: "#A09791" },
  qualityRow: { flexDirection: "row", gap: 8 },
  chip: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9BB068",
    borderRadius: 999,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: "#CFD9B5" },
  chipText: { color: "#8F8985" },
  chipTextActive: { color: "#5B6B2F" },
});
