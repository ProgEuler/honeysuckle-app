import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { Check, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface SpeechListeningBannerProps {
  onStop: () => void;
  onCancel: () => void;
}

function WaveBar({ delay, heightMultiplier = 1 }: { delay: number; heightMultiplier?: number }) {
  const scaleY = useSharedValue(0.3);

  useEffect(() => {
    scaleY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1 * heightMultiplier, {
            duration: 350,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.25, {
            duration: 350,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, heightMultiplier, scaleY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 3.5,
          height: 18,
          borderRadius: 2,
          backgroundColor: Colors.orange,
          marginHorizontal: 1.5,
        },
        animatedStyle,
      ]}
    />
  );
}

export function SpeechListeningBanner({
  onStop,
  onCancel,
}: SpeechListeningBannerProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutUp.duration(160)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF5EF",
        borderWidth: 1,
        borderColor: Colors.orange + "40",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginBottom: 10,
        shadowColor: Colors.orange,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Wave animation and listening label */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 20,
            paddingHorizontal: 2,
          }}
        >
          <WaveBar delay={0} heightMultiplier={0.7} />
          <WaveBar delay={120} heightMultiplier={1.0} />
          <WaveBar delay={240} heightMultiplier={0.85} />
          <WaveBar delay={360} heightMultiplier={0.6} />
        </View>

        <View>
          <RNText
            variant="medium"
            size="sm"
            style={{ color: Colors.orange, fontWeight: "600" }}
          >
            Listening...
          </RNText>
          <RNText size="xs" style={{ color: Colors.primaryText, fontSize: 11 }}>
            Speak clearly into your microphone
          </RNText>
        </View>
      </View>

      {/* Action buttons: Cancel and Done */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TouchableOpacity
          accessibilityLabel="Cancel speech input"
          accessibilityRole="button"
          onPress={onCancel}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#EFE8E5",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={15} color={Colors.brown} strokeWidth={2.4} />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Finish speech input"
          accessibilityRole="button"
          onPress={onStop}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: Colors.orange,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
          }}
        >
          <Check size={14} color={Colors.white} strokeWidth={3} />
          <RNText
            variant="medium"
            size="xs"
            style={{ color: Colors.white, fontWeight: "700" }}
          >
            Done
          </RNText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
