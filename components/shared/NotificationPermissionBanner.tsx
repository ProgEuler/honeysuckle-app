import Bell from "@/assets/svgs/notification.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { usePushPermission } from "@/hooks/usePushPermission";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function NotificationPermissionBanner() {
  const { enabled, enable } = usePushPermission();

  if (enabled !== false) return null;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <RNText variant="header" size="md" style={styles.title}>
          Push notifications are off
        </RNText>
        <RNText variant="medium" size="sm" style={styles.description}>
          Turn them on to get your check-in reminders and questionnaire due dates.
        </RNText>
      </View>
      <TouchableOpacity onPress={enable} activeOpacity={0.8} style={styles.button}>
        <RNText variant="header" size="sm" style={styles.buttonText}>
          Enable
        </RNText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.orange + "40",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#FFF1EA",
  },
  textContainer: { flex: 1, marginRight: 12 },
  title: { color: Colors.brown, marginBottom: 2 },
  description: { color: Colors.primaryText, lineHeight: 18 },
  button: {
    backgroundColor: Colors.brown,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: { color: Colors.white },
});
