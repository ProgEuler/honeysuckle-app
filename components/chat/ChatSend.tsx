import { Colors } from "@/constants/color";
import type { IMessage, SendProps } from "@kesha-antonov/react-native-chat";
import { ArrowUp, Square } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

/**
 * Custom send button:
 * - Default state: green pill with an up-arrow icon.
 * - Streaming state: orange pill with a stop icon.
 *
 * Always rendered (the composer reserves layout space for it).
 */
export function ChatSend<TMessage extends IMessage>(
  props: SendProps<TMessage> & {
    /** Provided by the screen so the send button can stop the stream. */
    isStreaming?: boolean;
    onStopStream?: () => void;
  },
) {
  const text = props.text?.trim() ?? "";
  const canSend = props.isTextOptional || text.length > 0;
  const isStreaming = !!props.isStreaming;

  const bg = isStreaming
    ? Colors.orange
    : canSend
      ? Colors.green
      : "#D9D2CE";

  const onPress = () => {
    if (isStreaming) {
      props.onStopStream?.();
      return;
    }
    props.onSend?.({ text } as Partial<TMessage>, true);
  };

  return (
    <View
      style={{
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        accessibilityLabel={isStreaming ? "Stop generating" : "Send message"}
        onPress={onPress}
        disabled={!canSend && !isStreaming}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {isStreaming ? (
          <Square
            color={Colors.white}
            width={16}
            height={16}
            fill="currentColor"
          />
        ) : (
          <ArrowUp
            color={Colors.white}
            width={20}
            height={20}
            strokeWidth={2.5}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}