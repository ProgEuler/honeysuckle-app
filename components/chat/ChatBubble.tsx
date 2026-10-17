import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import type {
  BubbleProps,
  IMessage,
} from "@kesha-antonov/react-native-chat";
import { Square } from "lucide-react-native";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

/**
 * Augmented BubbleProps: lets the screen hand a stop callback into each
 * rendered bubble without losing any of the upstream fields.
 */
export type ChatBubbleProps<TMessage extends IMessage> =
  BubbleProps<TMessage> & {
    onStopStream?: (message: TMessage) => void;
  };

/**
 * Custom bubble: asymmetric corners per side, shadow, body text, time
 * row inside, plus a stop button while the message is still streaming.
 *
 * We render the body text directly here instead of calling
 * `props.renderMessageText`. The library's helper short-circuits when
 * `currentMessage.text` is empty or falsy - which we'd hit every time
 * a server-fetched message used the legacy `message` field or had a
 * whitespace-only body. Rendering the body ourselves removes that
 * fragility and keeps the bubble layout entirely under our control.
 */
export function ChatBubble<TMessage extends IMessage>(
  props: ChatBubbleProps<TMessage>,
) {
  const { currentMessage, position } = props;
  if (!currentMessage) return null;

  const isUser = position === "right";

  // Bubble radius shrinks only on the *first* message of a group (consecutive
  // same-author bubbles share the tail side). Treat any missing/incomplete
  // previous message as the start of a new group so we never deref undefined.
  const prevUserId = props.previousMessage?.user?._id;
  const isFirstOfGroup =
    prevUserId == null || prevUserId !== currentMessage.user?._id;

  // Border-radius: tail-side is small for the classic chat look.
  const radii = {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: isUser ? 22 : isFirstOfGroup ? 6 : 22,
    borderBottomRightRadius: isUser ? (isFirstOfGroup ? 6 : 22) : 22,
  };

  const bodyText = resolveBodyText(currentMessage);

  return (
    <View
      style={{
        backgroundColor: isUser ? Colors.brown : "#E8DDD9",
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxWidth: 280,
        ...radii,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <RNText
        variant="base"
        size="md"
        style={{
          color: isUser ? Colors.white : Colors.brown,
          fontSize: 15,
          lineHeight: 22,
        }}
      >
        {bodyText}
        {currentMessage.streaming ? "  " : null}
      </RNText>

      <View
        style={{
          marginTop: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 6,
        }}
      >
        {currentMessage.streaming ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <ActivityIndicator
              size={10}
              color={isUser ? "#FFEFE8" : Colors.primaryText}
            />
            <RNText
              variant="base"
              size="xs"
              style={{
                color: isUser ? "#FFEFE8" : Colors.primaryText,
                fontFamily: "Medium",
              }}
            >
              Typing…
            </RNText>
          </View>
        ) : null}

        {/* {!isUser && currentMessage.streaming && props.onStopStream ? (
          <TouchableOpacity
            onPress={() => props.onStopStream?.(currentMessage)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: Colors.orange,
              alignItems: "center",
              justifyContent: "center",
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Square
              color={Colors.white}
              width={10}
              height={10}
              fill="currentColor"
            />
          </TouchableOpacity>
        ) : null} */}

        <RNText
          variant="base"
          size="xs"
          style={{
            color: isUser ? "#FFEFE8" : Colors.primaryText,
          }}
        >
          {formatBubbleTime(currentMessage.createdAt)}
        </RNText>
      </View>
    </View>
  );
}

/**
 * Pick the best available text content. Server history messages use the
 * `message` field (older backend), while streamed/optimistic messages use
 * the canonical `text` field.
 */
function resolveBodyText(message: IMessage): string {
  const anyMsg = message as unknown as Record<string, unknown>;
  const text =
    typeof anyMsg.text === "string"
      ? anyMsg.text
      : typeof anyMsg.message === "string"
        ? anyMsg.message
        : "";
  return text;
}

function formatBubbleTime(createdAt: Date | number) {
  const date =
    typeof createdAt === "number" ? new Date(createdAt) : createdAt;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
