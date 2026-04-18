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
        title: "Terms of Service for Honeysuckle Trail",
        body: "Effective Date: April 16, 2026\nLast Updated: April 16, 2026\n\nThese Terms of Service, called the \"Terms,\" are a legal agreement between you and Honeysuckle Co. LLC (\"Honeysuckle Trail,\" \"Company,\" \"we,\" \"us,\" or \"our\") and govern your access to and use of the Honeysuckle Trail app, website, and related services, together called the \"Service.\" By creating an account, accessing, or using the Service, you agree to these Terms. If you do not agree, do not use the Service.",
    },
    {
        title: "1. What Honeysuckle Trail Is",
        body: "Honeysuckle Trail is a journaling, reflection, wellness, and supportive AI app designed to help users track thoughts, moods, habits, and patterns and receive general prompts, reflections, summaries, and wellness insights.\n\nHoneysuckle Trail is not medical care, mental health treatment, therapy, counseling, crisis response, or a medical device. The Service does not diagnose, treat, cure, or prevent any medical or mental health condition. Any content provided through the Service is for general informational and self-reflection purposes only. Always seek advice from a qualified licensed medical or mental health professional for any health-related concerns.",
    },
    {
        title: "2. Emergency and Crisis Disclaimer",
        body: "Do not use the Service for emergencies. If you may be in danger, are thinking about self-harm, are thinking about harming someone else, or are experiencing a mental health crisis, contact emergency services or a qualified crisis resource right away.\n\nWhere available, call or text 988 for crisis support. If there is immediate danger, call 911 or your local emergency number.",
    },
    {
        title: "3. Eligibility",
        body: "You must be at least 18 years old to use the Service. By using the Service, you represent that:\n\n• You are at least 18 years old.\n• You have the legal capacity to agree to these Terms.\n• The information you provide is accurate and current.\n• Your use of the Service does not violate any applicable law.",
    },
    {
        title: "4. Account Registration and Security",
        body: "You may need to create an account to use some or all features of the Service. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.\n\nIf you believe your account has been accessed without your permission, contact us right away at hello@thehoneysucklecompany.com. We may suspend or terminate your account if we believe you are using the Service in violation of these Terms or in a way that could harm users, the Service, or others.",
    },
    {
        title: "5. Privacy Policy",
        body: "Your use of the Service is also governed by our Privacy Policy, which explains how we collect, use, store, share, and delete your information.\n\nPrivacy Policy: https://thehoneysucklecompany.com/privacy\n\nBy using the Service, you acknowledge that you have reviewed the Privacy Policy.",
    },
    {
        title: "6. User Content",
        body: "The Service may allow you to submit journal entries, assessment responses, reflections, messages, profile details, and other content, together called \"User Content.\"\n\nYou retain ownership of your User Content. However, you grant us a limited, nonexclusive, worldwide, royalty-free license to host, store, process, reproduce, and display your User Content only as reasonably necessary to:\n\n• Provide and operate the Service\n• Maintain safety and functionality\n• Improve user experience\n• Enforce these Terms\n• Comply with applicable law\n• Carry out the practices described in our Privacy Policy\n\nYou are solely responsible for your User Content and for the consequences of submitting it. You represent that you have all rights needed to submit your User Content and that it does not violate the law or the rights of any other person.",
    },
    {
        title: "7. AI Generated Content",
        body: "Some parts of the Service use artificial intelligence to generate responses, reflections, summaries, prompts, suggestions, or other content. You understand and agree that:\n\n• AI generated content may be incomplete, inaccurate, outdated, or inappropriate.\n• The Service may misunderstand your input or your situation.\n• AI generated content is not a substitute for licensed professional judgment, diagnosis, treatment, or crisis intervention.\n• You are responsible for evaluating any suggestion or output before acting on it.\n\nThe Service is meant to support reflection and wellness, not to make decisions for you.",
    },
    {
        title: "8. No Professional Relationship",
        body: "Your use of the Service does not create a therapist-patient, doctor-patient, counselor-client, fiduciary, or other professional relationship between you and the Company or between you and any AI feature offered through the Service.",
    },
    {
        title: "9. Prohibited Uses",
        body: "You agree not to:\n\n• Use the Service for any unlawful, harmful, fraudulent, or deceptive purpose.\n• Impersonate another person or misrepresent your identity.\n• Upload or transmit material that is abusive, threatening, defamatory, obscene, or otherwise unlawful.\n• Use the Service to harass, stalk, exploit, or endanger others.\n• Interfere with the operation or security of the Service.\n• Attempt to copy, scrape, reverse engineer, or extract source code, data, or models except as allowed by law.\n• Use the Service in a way that could create a risk of death, bodily injury, self-harm, or other serious harm.\n• Upload malware, viruses, or malicious code.\n• Bypass account, subscription, or security restrictions.",
    },
    {
        title: "10. Health and Sensitive Information",
        body: "The Service may involve personal reflections and health-related information. We handle information as described in our Privacy Policy. Unless we clearly state otherwise in writing, the Service is not offered as a HIPAA covered healthcare service, and you should not assume that HIPAA applies to information you choose to enter into the app.",
    },
    {
        title: "11. Third Party Services",
        body: "We may use third-party providers to help operate the Service, including providers for hosting, analytics, authentication, payment processing, support, communications, and AI services. Your use of some third-party services may also be subject to separate terms and privacy policies from those providers. We are not responsible for third-party services we do not control.",
    },
    {
        title: "12. Subscriptions and Payments",
        body: "Some features of the Service may be free. Some premium features may require a paid subscription. If offered, the current subscription price is $4.99 per month, unless otherwise shown at the time of purchase.\n\nIf you purchase a subscription through the Apple App Store or Google Play:\n\n• Billing will be handled by the applicable app store.\n• Subscriptions may automatically renew unless canceled before renewal.\n• You may manage or cancel your subscription through your app store account settings.\n• Refunds, if any, are handled according to the policies of the applicable app store unless required otherwise by law.\n\nWe may change pricing or subscription features in the future as permitted by law. Any change will apply going forward.",
    },
    {
        title: "13. Account Deletion",
        body: "You may request deletion of your account at any time through the app or through our account deletion page:\n\nDelete Account Page: https://thehoneysucklecompany.com/delete-account\n\nWhen you request deletion, we will process your request in accordance with our Privacy Policy and applicable law. Some information may be retained when needed for security, fraud prevention, dispute resolution, or legal compliance.",
    },
    {
        title: "14. Intellectual Property",
        body: "The Service, including its design, text, graphics, logos, software, features, and related intellectual property, is owned by Honeysuckle Co. LLC or its licensors and is protected by applicable law. Except for the limited right to use the Service under these Terms, no rights are granted to you.",
    },
    {
        title: "15. Limited License",
        body: "Subject to these Terms, we grant you a limited, revocable, nonexclusive, nontransferable license to use the Service for your personal, noncommercial use.",
    },
    {
        title: "16. Service Availability and Changes",
        body: "We may modify, suspend, or discontinue any part of the Service at any time, with or without notice. We do not guarantee that the Service will always be available, uninterrupted, secure, or error-free. We may release updates, fixes, or feature changes at any time.",
    },
    {
        title: "17. Termination",
        body: "We may suspend or terminate your access to the Service at any time if:\n\n• You violate these Terms.\n• We reasonably believe your use poses a safety, legal, or security risk.\n• We are required to do so by law.\n• We discontinue the Service.\n\nYou may stop using the Service at any time. Sections that should survive termination will remain in effect, including ownership, disclaimers, limitations of liability, dispute terms, and any accrued rights or obligations.",
    },
    {
        title: "18. Disclaimers",
        body: "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" TO THE MAXIMUM EXTENT PERMITTED BY LAW. WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, AND QUIET ENJOYMENT.\n\nWE DO NOT WARRANT THAT:\n\n• THE SERVICE WILL MEET YOUR REQUIREMENTS.\n• THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.\n• ANY OUTPUT OR CONTENT WILL BE ACCURATE, RELIABLE, OR SUITABLE FOR YOUR NEEDS.\n• THE SERVICE WILL PREVENT OR REDUCE ANY MENTAL HEALTH SYMPTOM, MEDICAL CONDITION, OR PERSONAL OUTCOME.",
    },
    {
        title: "19. Limitation of Liability",
        body: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, HONEYSUCKLE CO. LLC AND ITS OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AFFILIATES, LICENSORS, AND SERVICE PROVIDERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE.\n\nTO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE GREATER OF:\n\n• THE AMOUNT YOU PAID TO US FOR THE SERVICE IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR\n• ONE HUNDRED U.S. DOLLARS ($100).\n\nSOME STATES DO NOT ALLOW CERTAIN LIMITATIONS, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU.",
    },
    {
        title: "20. Indemnification",
        body: "You agree to defend, indemnify, and hold harmless Honeysuckle Co. LLC and its officers, directors, employees, affiliates, licensors, and service providers from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or related to:\n\n• Your use of the Service.\n• Your User Content.\n• Your violation of these Terms.\n• Your violation of any law or the rights of another person.",
    },
    {
        title: "21. Governing Law and Disputes",
        body: "These Terms are governed by the laws of the State of Idaho, without regard to conflict of law principles. Any dispute arising out of or relating to these Terms or the Service will be brought exclusively in the state or federal courts located in Idaho, and you consent to those courts.",
    },
    {
        title: "22. Changes to These Terms",
        body: "We may update these Terms from time to time. If we make material changes, we may provide notice by updating the effective date, posting notice in the app, sending an email, or using another reasonable method. Your continued use of the Service after updated Terms become effective means you agree to the revised Terms.",
    },
    {
        title: "23. Electronic Communications",
        body: "By using the Service, creating an account, or communicating with us electronically, you consent to receive communications from us electronically, including notices, disclosures, and updates.",
    },
    {
        title: "24. Entire Agreement",
        body: "These Terms, together with our Privacy Policy and any additional terms presented to you within the Service, constitute the entire agreement between you and Honeysuckle Co. LLC regarding the Service and replace prior agreements relating to the same subject matter.",
    },
    {
        title: "25. Severability",
        body: "If any provision of these Terms is found unenforceable, the remaining provisions will remain in full force and effect to the fullest extent permitted by law.",
    },
    {
        title: "26. No Waiver",
        body: "Our failure to enforce any provision of these Terms is not a waiver of our right to do so later.",
    },
    {
        title: "27. Contact Information",
        body: "If you have questions about these Terms or the Service, contact us at:\n\nHoneysuckle Co. LLC\nhello@thehoneysucklecompany.com\nhttps://thehoneysucklecompany.com/",
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
