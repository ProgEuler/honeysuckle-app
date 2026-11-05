import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { Heart, MessageCircle, MessageSquareText, Phone } from "lucide-react-native";
import type { ReactNode } from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

const open = (url: string) => Linking.openURL(url).catch(() => {});

const ActionButton = ({
  icon,
  label,
  onPress,
  primary,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  primary?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.action, primary && styles.actionPrimary]}
    accessibilityRole="button"
  >
    {icon}
    <RNText variant="header" size="md" style={{ color: primary ? Colors.white : Colors.brown }}>
      {label}
    </RNText>
  </TouchableOpacity>
);

/**
 * Shown when an answer reaches a question's safety threshold (e.g. PHQ-9
 * item 9), before any score. Points to people who can help right now.
 */
export default function SafetySupport({ onContinue }: { onContinue: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Heart size={30} color={Colors.orange} />
      </View>
      <RNText variant="title" size="2xl" style={styles.center}>
        You don't have to go through this alone
      </RNText>
      <RNText variant="medium" size="md" style={[styles.center, styles.body]}>
        One of your answers says you've had thoughts of being better off dead or of hurting
        yourself. Talking to someone can help, and you can reach someone right now, any time of
        day.
      </RNText>

      <View style={styles.actions}>
        <ActionButton
          primary
          icon={<Phone size={20} color={Colors.white} />}
          label="Call 988"
          onPress={() => open("tel:988")}
        />
        <ActionButton
          icon={<MessageSquareText size={20} color={Colors.brown} />}
          label="Text 988"
          onPress={() => open("sms:988")}
        />
        <ActionButton
          icon={<MessageCircle size={20} color={Colors.brown} />}
          label="Chat at 988lifeline.org"
          onPress={() => open("https://988lifeline.org/chat/")}
        />
      </View>

      <View style={styles.note}>
        <RNText variant="header" size="sm" style={{ color: Colors.brown }}>
          In immediate danger? Call 911.
        </RNText>
        <TouchableOpacity onPress={() => open("https://findahelpline.com")}>
          <RNText variant="medium" size="sm" style={styles.link}>
            Outside the US? Find a helpline in your country
          </RNText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onContinue} style={styles.continue}>
        <RNText variant="subtitle" size="md" style={{ color: Colors.primaryText }}>
          Continue to my results
        </RNText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 18, alignItems: "stretch" },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF1EA",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  center: { textAlign: "center" },
  body: { color: Colors.primaryText, lineHeight: 24 },
  actions: { gap: 12, marginTop: 6 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.brown,
    backgroundColor: Colors.white,
  },
  actionPrimary: { backgroundColor: Colors.brown },
  note: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    gap: 6,
    alignItems: "center",
  },
  link: { color: Colors.green, textDecorationLine: "underline" },
  continue: { alignItems: "center", paddingVertical: 12 },
});
