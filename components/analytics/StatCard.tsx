import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

type Props = {
  icon: LucideIcon;
  tint: string;
  color: string;
  label: string;
  value: string;
  unit?: string;
};

export default function StatCard({ icon: Icon, tint, color, label, value, unit }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.icon, { backgroundColor: tint }]}>
        <Icon size={18} color={color} />
      </View>
      <RNText variant="medium" size="sm" style={styles.label}>
        {label}
      </RNText>
      <RNText variant="title" size="2xl">
        {value}
        {!!unit && (
          <RNText variant="medium" size="sm" style={styles.label}>
            {" "}
            {unit}
          </RNText>
        )}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  label: { color: "#8F8985" },
});
