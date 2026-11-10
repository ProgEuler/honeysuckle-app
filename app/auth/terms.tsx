import { BackButton } from "@/components/ui/BackButton";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { TERMS } from "@/constants/terms-policy";
import { updateMe } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
    ArrowRight,
    ChevronDown,
    ExternalLink,
    Leaf,
    Lock,
    type LucideIcon,
    Phone,
    Sparkles,
    UserCheck,
} from "lucide-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const PRIVACY_POLICY_URL = "https://thehoneysucklecompany.com/privacy.html";

// Plain-language summary of the most important sections. The full terms
// below are the binding text.
const KEY_POINTS: { Icon: LucideIcon; title: string; body: string }[] = [
    {
        Icon: Leaf,
        title: "A wellness tool, not medical care",
        body: "Honeysuckle Trail helps you reflect and notice patterns. It doesn't diagnose or treat anything, and isn't therapy.",
    },
    {
        Icon: Phone,
        title: "Not for emergencies",
        body: "If you're in crisis, call or text 988. If you're in immediate danger, call 911.",
    },
    {
        Icon: Sparkles,
        title: "The AI can make mistakes",
        body: "Its replies are suggestions, not professional advice. Use your own judgment.",
    },
    {
        Icon: Lock,
        title: "Your data is yours",
        body: "We handle it as our Privacy Policy describes. You can delete your account and data any time in Settings.",
    },
    {
        Icon: UserCheck,
        title: "For adults",
        body: "You need to be at least 18 years old to use the app.",
    },
];

// "Effective Date: …" line from the start of the terms.
const EFFECTIVE_DATE = TERMS[0]?.body.split("\n")[0] ?? "";

export default function TermsScreen() {
    const { bottom } = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const setUserProfile = useAuthStore((state) => state.setUserProfile);
    const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);

    const handleBack = () => {
        if (user) {
            // Signed in but hasn't accepted yet: going back means not
            // continuing with this account, so sign out cleanly.
            clearAuthSession();
            router.replace("/auth");
            return;
        }
        router.back();
    };

    const handleContinue = async () => {
        if (!isAgreed) return;

        // Coming from post-auth flow (policy: false user) — update policy then go to onboarding
        if (user) {
            setIsSubmitting(true);
            try {
                const updated = await updateMe({ policy: true });
                setUserProfile({ ...user, ...updated, policy: true });
                router.replace("/onboarding");
            } catch {
                toast.error("Failed to save. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // Coming from signup flow before account creation
            router.replace({
                pathname: "/auth/signup",
                params: { acceptedTerms: "1" },
            });
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <BackButton onPress={handleBack} />

                <View style={styles.header}>
                    <RNText variant="medium" size="sm" style={{ color: Colors.green }}>
                        Before you start
                    </RNText>
                    <RNText variant="title" size="3xl">
                        Terms & Privacy
                    </RNText>
                    <RNText variant="medium" size="md" style={styles.muted}>
                        Here's what matters most, in plain words. The full terms are below.
                    </RNText>
                </View>

                <View style={styles.card}>
                    {KEY_POINTS.map(({ Icon, title, body }) => (
                        <View key={title} style={styles.point}>
                            <View style={styles.pointIcon}>
                                <Icon size={18} color={Colors.green} />
                            </View>
                            <View style={{ flex: 1, gap: 2 }}>
                                <RNText variant="header" size="md">
                                    {title}
                                </RNText>
                                <RNText variant="medium" size="sm" style={styles.muted}>
                                    {body}
                                </RNText>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.fullTermsHeader}>
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
                            <View key={section.title} style={[styles.section, index > 0 && styles.sectionDivider]}>
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
                                    <RNText variant="base" size="sm" style={styles.sectionBody}>
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
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: Math.max(bottom, 16) }]}>
                <TouchableOpacity
                    style={styles.agreeRow}
                    onPress={() => setIsAgreed((prev) => !prev)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isAgreed }}
                >
                    <Checkbox
                        value={isAgreed}
                        onValueChange={setIsAgreed}
                        color={isAgreed ? Colors.green : undefined}
                        style={styles.checkbox}
                    />
                    <RNText variant="medium" size="sm" style={styles.agreeText}>
                        I'm 18 or older and agree to the Terms of Service and Privacy Policy.
                    </RNText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleContinue}
                    disabled={!isAgreed || isSubmitting}
                    style={[styles.button, (!isAgreed || isSubmitting) && styles.buttonDisabled]}
                    accessibilityRole="button"
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <>
                            <RNText variant="header" size="lg" style={{ color: Colors.white }}>
                                Agree and continue
                            </RNText>
                            <ArrowRight size={18} color={Colors.white} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { flex: 1 },
    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
        gap: 20,
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
    },
    header: { gap: 6 },
    muted: { color: Colors.primaryText, lineHeight: 21 },
    card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 16 },
    point: { flexDirection: "row", gap: 12 },
    pointIcon: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: "#F2F5EB",
        alignItems: "center",
        justifyContent: "center",
    },
    fullTermsHeader: { gap: 2, marginTop: 4 },
    sections: { backgroundColor: Colors.white, borderRadius: 20, paddingHorizontal: 16 },
    section: { paddingVertical: 4 },
    sectionDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E8DDD9" },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
    sectionBody: { color: Colors.primaryText, lineHeight: 21, paddingBottom: 12 },
    privacyLink: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        gap: 12,
        backgroundColor: Colors.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E8DDD9",
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
    },
    agreeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    checkbox: { borderRadius: 6 },
    agreeText: { flex: 1, color: Colors.brown, lineHeight: 20 },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 56,
        borderRadius: 28,
        backgroundColor: Colors.brown,
    },
    buttonDisabled: { opacity: 0.45 },
});
