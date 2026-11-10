import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SpeechListeningBannerProps {
  onStop: () => void;
  onCancel: () => void;
}

/** Slowly pulsing dot: shows the mic is live. */
function LiveDot() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.3, { duration: 700 }), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.orange }, style]}
    />
  );
}

export function SpeechListeningBanner({ onStop, onCancel }: SpeechListeningBannerProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(120)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 4,
        marginBottom: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
        <LiveDot />
        <RNText variant="medium" size="sm" style={{ color: Colors.brown }}>
          Listening
        </RNText>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Cancel speech input"
        onPress={onCancel}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ paddingHorizontal: 10 }}
      >
        <RNText variant="medium" size="sm" style={{ color: Colors.primaryText }}>
          Cancel
        </RNText>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Finish speech input"
        onPress={onStop}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ paddingLeft: 10 }}
      >
        <RNText variant="header" size="sm" style={{ color: Colors.brown }}>
          Done
        </RNText>
      </TouchableOpacity>
    </Animated.View>
  );
}
