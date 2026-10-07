import React, { useEffect } from "react";
import { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

type Props = {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
};

/**
 * Base shimmer block. Pulses opacity 0.4 → 1 → 0.4 on a 1.2s loop.
 * Color is the warm off-white from the app's neutral palette so skeletons
 * blend in on the cream background (#F7F4F2).
 */
export default function Skeleton({
    width = "100%",
    height = 12,
    borderRadius = 6,
    style,
}: Props) {
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, {
                duration: 600,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true,
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: "#E8E4DF",
                },
                animatedStyle,
                style,
            ]}
        />
    );
}