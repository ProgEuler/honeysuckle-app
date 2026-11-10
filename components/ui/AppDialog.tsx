import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import type { ReactNode } from "react";
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  /** Plain text, or text with inline links. */
  message: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  /** Red confirm button, for actions that delete something. */
  destructive?: boolean;
  /** Shows a spinner on the confirm button and disables both buttons. */
  loading?: boolean;
};

/**
 * The app's centered dialog: title, short message, and a Cancel | Confirm
 * button row, like a native alert in the app's colors.
 */
export default function AppDialog({
  visible,
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel,
  onCancel,
  onConfirm,
  destructive,
  loading,
}: Props) {
  const confirmColor = destructive ? "#C0392B" : Colors.green;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => !loading && onCancel()}
    >
      <View style={styles.overlay}>
        <View style={styles.card} accessibilityRole="alert">
          <View style={styles.body}>
            <RNText variant="title" size="xl" style={styles.title}>
              {title}
            </RNText>
            {typeof message === "string" ? (
              <RNText variant="medium" size="md" style={styles.text}>
                {message}
              </RNText>
            ) : (
              message
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.action}
              onPress={onCancel}
              disabled={loading}
              accessibilityRole="button"
            >
              <RNText variant="medium" size="lg" style={styles.cancel}>
                {cancelLabel}
              </RNText>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.action}
              onPress={onConfirm}
              disabled={loading}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color={confirmColor} />
              ) : (
                <RNText variant="header" size="lg" style={{ color: confirmColor }}>
                  {confirmLabel}
                </RNText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/** Message text style, for dialogs whose message has inline links. */
export const dialogTextStyle = {
  textAlign: "center" as const,
  color: Colors.primaryText,
  lineHeight: 23,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: "hidden",
  },
  body: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 20, gap: 12 },
  title: { textAlign: "center", color: Colors.brown },
  text: dialogTextStyle,
  actions: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8DDD9",
  },
  action: { flex: 1, minHeight: 54, alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  divider: { width: StyleSheet.hairlineWidth, backgroundColor: "#E8DDD9" },
  cancel: { color: Colors.primaryText },
});
