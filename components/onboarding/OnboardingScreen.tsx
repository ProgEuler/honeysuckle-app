import ArrowRight from "@/assets/svgs/arrowright.svg";
import { BackButton } from "@/components/ui/BackButton";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import type { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

/** Small phones (iPhone SE, compact Androids) get smaller type and spacing. */
export function useCompactLayout() {
  const { width, height } = useWindowDimensions();
  return width < 375 || height < 720;
}

type Props = {
  /** e.g. "Step 01 · Daily Check-In" */
  step?: string;
  /** Title lines; the second is shown in green. */
  title: [string, string?];
  description?: string;
  showBack?: boolean;
  /** Center the content vertically (welcome screen). */
  centered?: boolean;
  /** Pinned bottom button. */
  action: { label: string; onPress: () => void };
  /** Shown above the title (e.g. the logo on the welcome screen). */
  above?: ReactNode;
  children?: ReactNode;
};

/**
 * Shared onboarding layout: header and content scroll, the main button stays
 * pinned above the home indicator, so nothing relies on fixed bottom padding
 * and the button is always reachable on short screens.
 */
export default function OnboardingScreen({
  step,
  title,
  description,
  showBack = true,
  centered,
  action,
  above,
  children,
}: Props) {
  const compact = useCompactLayout();
  const { bottom } = useSafeAreaInsets();
  const gutter = compact ? 20 : 24;
  const titleSize = compact ? "3xl" : "4xl";
  const titleLineHeight = compact ? 36 : 44;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: gutter, gap: compact ? 20 : 28 },
          centered && styles.centered,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        {showBack && <BackButton />}
        {above}

        <View style={styles.header}>
          {!!step && (
            <RNText variant="medium" size="sm" style={styles.step}>
              {step}
            </RNText>
          )}
          <View>
            <RNText variant="title" size={titleSize} style={{ lineHeight: titleLineHeight }}>
              {title[0]}
            </RNText>
            {!!title[1] && (
              <RNText
                variant="title"
                size={titleSize}
                style={{ lineHeight: titleLineHeight, color: Colors.green }}
              >
                {title[1]}
              </RNText>
            )}
          </View>
          {!!description && (
            <RNText variant="medium" size={compact ? "sm" : "md"} style={styles.description}>
              {description}
            </RNText>
          )}
        </View>

        {children}
      </KeyboardAwareScrollView>

      <View style={[styles.footer, { paddingHorizontal: gutter, paddingBottom: Math.max(bottom, 16) }]}>
        <TouchableOpacity onPress={action.onPress} style={styles.button} accessibilityRole="button">
          <RNText variant="header" size="lg" style={styles.buttonText}>
            {action.label}
          </RNText>
          <ArrowRight fill={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 16,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  centered: { justifyContent: "center" },
  header: { gap: 8 },
  step: { color: Colors.green },
  description: { color: Colors.primaryText, lineHeight: 24 },
  footer: { paddingTop: 12, width: "100%", maxWidth: 560, alignSelf: "center" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.brown,
    minHeight: 56,
    borderRadius: 100,
  },
  buttonText: { color: Colors.white },
});
