import { Colors } from "@/constants/color";
import TypeIcon from "@/assets/svgs/type.svg";
import type { ComposerProps } from "@kesha-antonov/react-native-chat";
import { View } from "react-native";
import { TextInput } from "react-native";

/**
 * Custom composer: dark plum left, thin green ring, sage bg.
 * `props.textInputProps.onChangeText` is exposed by Chat and drives the
 * controlled `text` state. We forward all keyboard props through.
 */
export function ChatComposer(props: ComposerProps) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.green,
        borderRadius: 28,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.background,
      }}
    >
      <TypeIcon />
      <TextInput
        placeholder="Type to start chatting..."
        placeholderTextColor={Colors.primaryText}
        autoCorrect={false}
        autoCapitalize="sentences"
        spellCheck={false}
        multiline
        value={props.text}
        onChangeText={(t) =>
          props.textInputProps?.onChangeText?.(t)
        }
        onContentSizeChange={props.textInputProps?.onContentSizeChange}
        style={{
          flex: 1,
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 15,
          fontFamily: "Regular",
          color: Colors.brown,
          maxHeight: 100,
        }}
        {...props.textInputProps}
      />
    </View>
  );
}