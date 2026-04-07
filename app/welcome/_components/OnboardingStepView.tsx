import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

type Props = {
    title: string;
    stepLabel: string;
    coloredWords: string[];
    color: string;
    image: any;
    onNext: () => void;
    buttonLabel?: string;
};

export function OnboardingStepView({
    title,
    stepLabel,
    coloredWords,
    color,
    image,
    onNext,
    buttonLabel = "Next",
}: Props) {
    const { bottom } = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Image source={image} style={styles.backgroundImage} resizeMode="cover" />

            <View style={[styles.bottomCard, { paddingBottom: bottom + 28 }]}>
                <View style={[styles.stepBadge, { backgroundColor: color + "15" }]}>
                    <RNText variant="header" size="xs" style={{ color }}>
                        {stepLabel}
                    </RNText>
                </View>

                <View style={styles.titleContainer}>{renderTitle(title, coloredWords, color)}</View>

                <TouchableOpacity activeOpacity={0.9} style={styles.nextButton} onPress={onNext}>
                    <RNText variant="header" size="md" style={styles.nextButtonText}>
                        {buttonLabel}
                    </RNText>
                    <ArrowRight color={Colors.white} size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function renderTitle(title: string, coloredWords: string[], color: string) {
    const parts = title.split(" ");

    return (
        <RNText variant="title" size="3xl" style={styles.titleText}>
            {parts.map((part, index) => {
                const cleanPart = part.replace(/[^\w]/g, "");
                const isColored = coloredWords.some(
                    (word) => cleanPart.toLowerCase() === word.toLowerCase(),
                );

                return (
                    <RNText
                        key={`${part}-${index}`}
                        variant="title"
                        size="3xl"
                        style={[styles.titleText, isColored && { color }]}
                    >
                        {part}{" "}
                    </RNText>
                );
            })}
        </RNText>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "flex-end",
    },
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height: height * 0.72,
    },
    bottomCard: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 28,
        paddingTop: 32,
        alignItems: "center",
        minHeight: height * 0.4,
    },
    stepBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 20,
    },
    titleContainer: {
        width: "100%",
        marginBottom: 28,
        paddingHorizontal: 10,
    },
    titleText: {
        textAlign: "center",
        lineHeight: 44,
        color: Colors.brown,
    },
    nextButton: {
        width: "100%",
        borderRadius: 40,
        backgroundColor: Colors.brown,
        paddingVertical: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },
    nextButtonText: {
        color: Colors.white,
    },
});
