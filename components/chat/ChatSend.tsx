import { Colors } from "@/constants/color";
import type { IMessage, SendProps } from "@kesha-antonov/react-native-chat";
import { ArrowUp, Square } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

/**
 * Custom send button:
 * - Something typed: green circle with an up-arrow icon.
 * - Streaming: green circle with a white square stop icon.
 * - Otherwise hidden, so the text box gets the full width.
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

  if (!canSend && !isStreaming) {
    return null;
  }

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
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: Colors.green,
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
            color={"#fff"}
            width={16}
            height={16}
            fill="#fff"
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
