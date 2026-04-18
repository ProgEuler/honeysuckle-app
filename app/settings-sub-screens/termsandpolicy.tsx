import Back from "@/assets/svgs/back.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { TERMS } from "@/constants/terms-policy";
import { router } from "expo-router";
import { ArrowDown } from "lucide-react-native";
import { useRef, useState } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsAndPolicyScreen() {
    const scrollRef = useRef<ScrollView>(null);
    const { bottom } = useSafeAreaInsets();

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

        const atBottom = y + lHeight >= cHeight - 20;
        setShowDownArrow(isScrollable && !atBottom);
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
                    <RNText variant="title" size="xl" style={styles.title}>
                        Terms & Policy
                    </RNText>
                </View>
            </View>

            <ScrollView
                ref={scrollRef}
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom + 40 }]}
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
});
