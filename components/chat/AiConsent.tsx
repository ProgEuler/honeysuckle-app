import AppDialog, { dialogTextStyle } from "@/components/ui/AppDialog";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useAuthStore } from "@/store/useAuthStore";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

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
    <AppDialog
      visible={visible}
      title="Welcome to your AI companion"
      message={
        <RNText variant="medium" size="md" style={dialogTextStyle}>
          To reply, your messages and a summary of your recent check-ins and questionnaire scores
          are sent to OpenAI. Your journal is never shared. The AI isn't a therapist; in a crisis,
          call or text 988. Read our <Link label="Terms of Service" url={TERMS_URL} /> and{" "}
          <Link label="Privacy Policy" url={PRIVACY_URL} />. By tapping Agree, you consent to this.
        </RNText>
      }
      cancelLabel="Disagree"
      confirmLabel="Agree"
      onCancel={() => router.back()}
      onConfirm={onAgree}
    />
  );
}

const styles = StyleSheet.create({
  link: { color: Colors.green, textDecorationLine: "underline" },
});
