import { Colors } from "@/constants/color";
import type { PartialChatTheme } from "@kesha-antonov/react-native-chat";

/**
 * Project-wide theme for the chat UI. Tones match the existing app palette
 * (warm browns, soft creams, sage-green accent).
 */
export const chatTheme: PartialChatTheme = {
  colors: {
    accent: Colors.green,
    background: Colors.background,
    incomingBubble: "#E8DDD9",
    outgoingBubble: Colors.brown,
    incomingText: Colors.brown,
    outgoingText: Colors.white,
    incomingMeta: Colors.primaryText,
    outgoingMeta: "#FFEFE8",
    senderName: Colors.orange,
    ticksSent: "#9BB068",
    ticksRead: Colors.green,
    separator: "#EFE7E2",
    inputBackground: Colors.background,
    inputBarBackground: Colors.white,
    inputText: Colors.brown,
    placeholder: Colors.primaryText,
    dayPillBackground: "#EDE5DF",
    dayPillText: Colors.primaryText,
    surface: Colors.white,
    reactionBackground: "#EFE7E2",
    reactionActiveBackground: Colors.yellow,
    outgoingOverlay: "rgba(0,0,0,0.04)",
    error: Colors.orange,
    inputFieldBorder: Colors.green,
  },
  radii: {
    bubble: 22,
    bubbleGrouped: 18,
    inputField: 28,
    sendButton: 100,
    reaction: 18,
    dayPill: 18,
  },
  spacing: {
    bubblePaddingV: 10,
    bubblePaddingH: 16,
    betweenGroups: 12,
    withinGroup: 2,
    inputToolbarPaddingV: 16,
  },
  typography: {
    message: {
      fontSize: 15,
      lineHeight: 22,
    },
    time: {
      fontSize: 11,
      lineHeight: 14,
    },
    senderName: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "600",
    },
    day: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: "600",
    },
    system: {
      fontSize: 12,
      lineHeight: 16,
    },
  },
  avatar: {
    size: 36,
    textColor: Colors.brown,
  },
  sendButton: {
    size: 44,
  },
  composer: {
    minHeight: 44,
    maxHeight: 120,
    fieldPaddingH: 14,
    insetIconSize: 22,
  },
};
