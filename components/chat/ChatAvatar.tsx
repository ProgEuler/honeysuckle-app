import { Boticon } from "@/components/icons/boticon";
import { Colors } from "@/constants/color";
import type { AvatarProps, IMessage } from "@kesha-antonov/react-native-chat";
import { User2 } from "lucide-react-native";
import { View } from "react-native";

/**
 * Avatar shown next to each message.
 * - Assistant: brand `Boticon` (4-dot die pattern).
 * - User: dark brown pill with a `User2` lucide icon.
 *
 * The avatar itself is intentionally low-key so the bubble stays the focal point.
 */
export function ChatAvatar<TMessage extends IMessage>(
  props: AvatarProps<TMessage>,
) {
  const messageUserId = props.currentMessage?.user?._id;
  const isUser = messageUserId != null && String(messageUserId) === String(USER_ID);

  if (isUser) {
    return (
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: Colors.brown,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <User2 color="#BFA79A" width={18} height={18} />
      </View>
    );
  }

  return <Boticon size={32} />;
}

/** Stable id used for the local user across the screen and helpers. */
export const USER_ID = 1;
/** Stable id for the assistant user. */
export const ASSISTANT_ID = 2;