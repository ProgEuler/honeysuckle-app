import TypeIcon from "@/assets/svgs/type.svg";
import { Colors } from "@/constants/color";
import type { ComposerProps } from "@kesha-antonov/react-native-chat";
import { Mic } from "lucide-react-native";
import React, { useEffect } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export interface ChatComposerProps extends ComposerProps {
  isListening?: boolean;
  onToggleListening?: () => void;
}

/**
 * Custom composer:
 * - Left: TypeIcon
 * - Middle: Multiline TextInput
 * - Right: Animated Speech-to-Text Mic button
 */
export function ChatComposer(props: ChatComposerProps) {
  const isListening = !!props.isListening;
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.22, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1.0, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        true,
      );
    } else {
      pulse.value = 1;
    }
  }, [isListening, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: isListening ? Colors.orange : Colors.green,
        borderRadius: 28,
        paddingHorizontal: 12,
        paddingVertical: 5,
        backgroundColor: Colors.background,
      }}
    >
      <TypeIcon />
      <TextInput
        placeholder={
          isListening
            ? "Listening... speak now"
            : "Type or tap mic to speak..."
        }
        placeholderTextColor={
          isListening ? Colors.orange : Colors.primaryText
        }
        autoCorrect={false}
        autoCapitalize="sentences"
        spellCheck={false}
        multiline
        value={props.text}
        onChangeText={(t) => props.textInputProps?.onChangeText?.(t)}
        onContentSizeChange={props.textInputProps?.onContentSizeChange}
        style={{
          flex: 1,
          paddingVertical: 6,
          paddingHorizontal: 10,
          fontSize: 15,
          fontFamily: "Regular",
          color: Colors.brown,
          maxHeight: 100,
        }}
        {...props.textInputProps}
      />

      {/* Speech-to-text mic button */}
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {isListening && (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: Colors.orange + "30",
              },
              pulseStyle,
            ]}
          />
        )}
        <TouchableOpacity
          accessibilityLabel={
            isListening ? "Stop voice listening" : "Speak to text"
          }
          accessibilityRole="button"
          onPress={props.onToggleListening}
          activeOpacity={0.7}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isListening ? Colors.orange : "#EAE2DC",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mic
            color={isListening ? Colors.white : Colors.brown}
            size={17}
            strokeWidth={2.4}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}