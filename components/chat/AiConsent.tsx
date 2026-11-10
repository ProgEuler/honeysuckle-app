import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useAuthStore } from "@/store/useAuthStore";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

// Bump when what's shared with the AI changes, so people are asked again.
const CONSENT_VERSION = 1;

const TERMS_URL = "https://thehoneysucklecompany.com/terms.html";
const PRIVACY_URL = "https://thehoneysucklecompany.com/privacy.html";

const consentKey = (userId: string) => `ai-consent-v${CONSENT_VERSION}-${userId}`;

/**
 * Whether the signed-in user has agreed to their chat messages and check-in
 * summaries being sent to the third-party AI provider (App Store guideline
 * 5.1.2(i)). Stored per user on this device.
 */
export function useAiConsent() {
  const userId = useAuthStore((state) => state.user?.id);
  const [status, setStatus] = useState<"loading" | "granted" | "needed">("loading");

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    SecureStore.getItemAsync(consentKey(userId))
      .then((value) => !cancelled && setStatus(value ? "granted" : "needed"))
      .catch(() => !cancelled && setStatus("needed"));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const grant = useCallback(async () => {
    if (userId) {
      await SecureStore.setItemAsync(consentKey(userId), new Date().toISOString()).catch(() => {});
    }
    setStatus("granted");
  }, [userId]);

  return { status, grant };
}

const Link = ({ label, url }: { label: string; url: string }) => (
  <RNText
    variant="medium"
    size="md"
    style={styles.link}
    onPress={() => WebBrowser.openBrowserAsync(url)}
    accessibilityRole="link"
  >
    {label}
  </RNText>
);

/** Asks once, before the first chat, whether the user agrees to AI data sharing. */
export function AiConsentModal({ visible, onAgree }: { visible: boolean; onAgree: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => router.back()}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.body}>
            <RNText variant="title" size="xl" style={styles.title}>
              Welcome to your AI companion
            </RNText>
            <RNText variant="medium" size="md" style={styles.text}>
              To reply, your messages and a summary of your recent check-ins and questionnaire
              scores are sent to OpenAI. Your journal is never shared. The AI isn't a therapist;
              in a crisis, call or text 988. Read our <Link label="Terms of Service" url={TERMS_URL} />{" "}
              and <Link label="Privacy Policy" url={PRIVACY_URL} />. By tapping Agree, you consent
              to this.
            </RNText>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.action} onPress={() => router.back()} accessibilityRole="button">
              <RNText variant="medium" size="lg" style={styles.disagree}>
                Disagree
              </RNText>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.action} onPress={onAgree} accessibilityRole="button">
              <RNText variant="header" size="lg" style={styles.agree}>
                Agree
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
  text: { textAlign: "center", color: Colors.primaryText, lineHeight: 23 },
  link: { color: Colors.green, textDecorationLine: "underline" },
  actions: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8DDD9",
  },
  action: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  divider: { width: StyleSheet.hairlineWidth, backgroundColor: "#E8DDD9" },
  disagree: { color: Colors.primaryText },
  agree: { color: Colors.green },
});
