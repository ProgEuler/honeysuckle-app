import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { TERMS } from "@/constants/terms-policy";
import * as WebBrowser from "expo-web-browser";
import { ChevronDown, ExternalLink } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const PRIVACY_POLICY_URL = "https://thehoneysucklecompany.com/privacy.html";

// "Effective Date: …" line from the start of the terms.
const EFFECTIVE_DATE = TERMS[0]?.body.split("\n")[0] ?? "";

/**
 * The full Terms of Service as collapsible sections, plus a Privacy Policy
 * link. Used after sign-up and in Settings.
 */
export default function TermsSections() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <RNText variant="header" size="lg">
          Full Terms of Service
        </RNText>
        {!!EFFECTIVE_DATE && (
          <RNText variant="medium" size="xs" style={styles.muted}>
            {EFFECTIVE_DATE}
          </RNText>
        )}
      </View>

      <View style={styles.sections}>
        {TERMS.map((section, index) => {
          const open = openSection === section.title;
          return (
            <View key={section.title} style={[styles.section, index > 0 && styles.divider]}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setOpenSection(open ? null : section.title)}
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
              >
                <RNText variant="subtitle" size="md" style={{ flex: 1 }}>
                  {index === 0 ? "Introduction" : section.title}
                </RNText>
                <ChevronDown
                  size={18}
                  color={Colors.primaryText}
                  style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
                />
              </TouchableOpacity>
              {open && (
                <RNText variant="base" size="sm" style={styles.body}>
                  {section.body}
                </RNText>
              )}
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.privacyLink}
        onPress={() => WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL)}
        accessibilityRole="link"
      >
        <RNText variant="subtitle" size="md" style={{ color: Colors.green }}>
          Read our Privacy Policy
        </RNText>
        <ExternalLink size={16} color={Colors.green} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  header: { gap: 2 },
  muted: { color: Colors.primaryText },
  sections: { backgroundColor: Colors.white, borderRadius: 20, paddingHorizontal: 16 },
  section: { paddingVertical: 4 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E8DDD9" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  body: { color: Colors.primaryText, lineHeight: 21, paddingBottom: 12 },
  privacyLink: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", marginTop: 4 },
});
