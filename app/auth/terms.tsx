import Back from "@/assets/svgs/back.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { updateMe } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import Checkbox from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowDown, ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
   ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { toast } from "sonner-native";

const TERMS = [
    {
        title: "Clause 1",
        body: "By creating an account, you agree to use this app respectfully and only for lawful personal wellbeing purposes.",
    },
    {
        title: "Clause 2",
        body: "Your entries are intended for personal reflection. You are responsible for the information you choose to provide.",
    },
    {
        title: "Clause 3",
        body: "The app provides supportive tools and is not a replacement for professional medical or emergency care.",
    },
    {
        title: "Clause 4",
        body: "You can stop using the service anytime. Continued use means you accept updates to these terms.",
    },
    {
        title: "Clause 5",
        body: "We may occasionally update app features to improve your experience, and minor interface changes may happen without prior notice.",
    },
    {
        title: "Clause 6",
        body: "If you choose to enable reminders, you consent to receiving gentle in-app notifications based on your selected schedule.",
    },
    {
        title: "Clause 7",
        body: "You are encouraged to keep your account credentials private. You are responsible for activity under your signed-in session.",
    },
    {
        title: "Clause 8",
        body: "Feedback you share may be used to improve future versions of the app, while respecting applicable privacy commitments.",
    },
];

export default function TermsScreen() {
    const scrollRef = useRef<ScrollView>(null);
    const { bottom } = useSafeAreaInsets();
    const { from } = useLocalSearchParams<{ from?: string }>();
    const setUserProfile = useAuthStore((state) => state.setUserProfile);
    const user = useAuthStore((state) => state.user);

    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const [showDownArrow, setShowDownArrow] = useState(false);
    const [layoutHeight, setLayoutHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    const updateScrollability = (content: number, layout: number) => {
        const scrollable = content > layout + 2;
        setIsScrollable(scrollable);
        setShowDownArrow(scrollable);
    };

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const {
            contentOffset: { y },
            contentSize: { height: cHeight },
            layoutMeasurement: { height: lHeight },
        } = event.nativeEvent;

        const atBottom = y + lHeight >= cHeight - 108;
        setShowDownArrow(isScrollable && !atBottom);
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
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Back />
                </TouchableOpacity>
                <View style={styles.headerTextWrap}>
                    <RNText variant="medium" size="sm" style={styles.agreementLabel}>
                        AGREEMENT
                    </RNText>
                    <RNText variant="title" size="3xl" style={styles.title}>
                        Terms of Service
                    </RNText>
                </View>
            </View>

            <ScrollView
                ref={scrollRef}
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
                onLayout={(event) => {
                    const nextLayoutHeight = event.nativeEvent.layout.height;
                    setLayoutHeight(nextLayoutHeight);
                    updateScrollability(contentHeight, nextLayoutHeight);
                }}
                onContentSizeChange={(_, nextContentHeight) => {
                    setContentHeight(nextContentHeight);
                    updateScrollability(nextContentHeight, layoutHeight);
                }}
            >
                {TERMS.map((item) => (
                    <View key={item.title} style={styles.clauseBlock}>
                        <RNText variant="title" size="xl" style={styles.clauseTitle}>
                            {item.title}
                        </RNText>
                        <RNText variant="medium" size="md" style={styles.clauseBody}>
                            {item.body}
                        </RNText>
                    </View>
                ))}

                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={styles.agreeRow}
                        onPress={() => setIsAgreed((prev) => !prev)}
                    >
                        <Checkbox
                            value={isAgreed}
                            onValueChange={setIsAgreed}
                            color={Colors.green}
                            style={styles.checkbox}
                        />
                        <RNText variant="medium" size="md" style={styles.agreeText}>
                            I agree to Terms
                        </RNText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleContinue}
                        disabled={!isAgreed || isSubmitting}
                        style={[
                            styles.continueButton,
                            (!isAgreed || isSubmitting) && styles.continueButtonDisabled,
                        ]}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <>
                                <RNText variant="header" size="lg" style={styles.continueText}>
                                    Continue
                                </RNText>
                                <ArrowRight size={18} color={Colors.white} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {showDownArrow && (
                <TouchableOpacity
                    style={[styles.downArrowButton, { bottom: bottom + 24 }]}
                    onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                    <ArrowDown size={38} color={Colors.white} />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E7E1DD",
    },
    backButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.brown,
        borderRadius: 40,
        marginRight: 12,
    },
    headerTextWrap: {
        flex: 1,
        gap: 4,
    },
    agreementLabel: {
        color: "#A59C97",
    },
    title: {
        color: Colors.brown,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 16,
    },
    clauseBlock: {
        marginBottom: 24,
        gap: 10,
    },
    clauseTitle: {
        color: Colors.brown,
    },
    clauseBody: {
        color: Colors.primaryText,
        lineHeight: 28,
    },
    downArrowButton: {
        position: "absolute",
        right: 20,
        width: 65,
        height: 65,
        borderRadius: 50,
        backgroundColor: Colors.brown,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    bottomSection: {
        borderTopWidth: 1,
        borderTopColor: "#E7E1DD",
        marginTop: 4,
        paddingTop: 12,
        gap: 12,
    },
    agreeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    checkbox: {
        borderRadius: 6,
    },
    agreeText: {
        color: Colors.brown,
    },
    continueButton: {
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.brown,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    continueButtonDisabled: {
        opacity: 0.45,
    },
    continueText: {
        color: Colors.white,
    },
});
