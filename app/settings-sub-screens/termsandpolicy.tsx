import TermsSections from "@/components/terms/TermsSections";
import { Colors } from "@/constants/color";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

/** Settings → Terms of Service: the same collapsible sections as after sign-up. */
export default function TermsAndPolicyScreen() {
    const { bottom } = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.content, { paddingBottom: bottom + 24 }]}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
            >
                <TermsSections />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { flex: 1 },
    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
    },
});
