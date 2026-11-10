import {
  ASSISTANT_ID,
  ChatAvatar,
  USER_ID,
} from "@/components/chat/ChatAvatar";
import { AiConsentModal, useAiConsent } from "@/components/chat/AiConsent";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatSend } from "@/components/chat/ChatSend";
import { SpeechListeningBanner } from "@/components/chat/SpeechListeningBanner";
import { chatTheme } from "@/components/chat/theme";
import { useStreamChatReply } from "@/components/chat/streaming";
import ChatHistorySkeleton from "@/components/skeletons/screens/ChatHistorySkeleton";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import {
  chatHistoryQueryKey,
  useChatHistoryQuery,
} from "@/hooks/useChatHistoryQuery";
import {
  ChatHistoryMessage,
} from "@/lib/api/chat";
import {
  Chat,
  type IMessage,
  useStreamingMessages,
} from "@kesha-antonov/react-native-chat";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const PAGE_SIZE = 20;

const ChatPage = () => {
  const queryClient = useQueryClient();
  const aiConsent = useAiConsent();
  const insets = useSafeAreaInsets();
  // iOS native-stack header is ~44pt + safe-area top (~44-59pt on modern
  // phones), so reserve that space at the top of the list. Without this,
  // the first message slides *under* the frosted header and gets blurred
  // into the nav bar's background.
  const headerInset = insets.top + 56;

  // ----- backend history -----
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatHistoryQuery(PAGE_SIZE);

  // ----- streaming state for the AI reply -----
  const {
    messages,
    setMessages,
    startStream,
    stop: stopStream,
    isStreaming,
  } = useStreamingMessages<IMessage>({
    inverted: true, // Chat renders newest at the bottom by default
  });

  const { streamReply } = useStreamChatReply(PAGE_SIZE);

  /**
   * Seed the streaming messages list with the server history exactly once
   * per mount. After that, the local state is authoritative for both
   * optimistic user messages and streamed assistant replies. Re-seeding
   * on every refetch would wipe the streaming placeholder and the
   * optimistic user bubble, causing UI jank.
   *
   * When the user clears the history (via the header menu), the
   * `clearChatMutation` resets `seededRef` so the next data load becomes
   * a fresh seed.
   */
  const seededRef = useRef(false);
  const lastServerTotalRef = useRef<number>(-1);
  useEffect(() => {
    if (!data?.pages) return;
    const serverTotal = data.pages.reduce(
      (acc, page) => acc + (page.messages?.length ?? 0),
      0,
    );

    // First successful seed: load server history into the streaming list.
    if (!seededRef.current) {
      const oldestToNewest: ChatHistoryMessage[] = [...data.pages]
        .reverse()
        .flatMap((page) => [...page.messages].reverse());
      const apiMessages: IMessage[] = oldestToNewest
        .slice()
        .reverse()
        .map(toIMessage);
      setMessages(apiMessages);
      seededRef.current = true;
      lastServerTotalRef.current = serverTotal;
      return;
    }

    // Clear-history was tapped in the header modal: server count dropped
    // to 0. Wipe local optimistic + streamed state and re-arm the seed
    // ref so the next server response is treated as a fresh load.
    if (
      lastServerTotalRef.current > 0 &&
      serverTotal === 0
    ) {
      setMessages([]);
      seededRef.current = false;
    }
    lastServerTotalRef.current = serverTotal;
  }, [data?.pages, setMessages]);

  // ----- speech-to-text state -----
  const currentComposerTextRef = useRef("");
  const composerChangeTextRef = useRef<((t: string) => void) | undefined>(undefined);
  const speechInitialTextRef = useRef("");

  const {
    isListening,
    startListening,
    stopListening,
    abortListening,
  } = useSpeechToText({
    onTranscript: (fullText) => {
      composerChangeTextRef.current?.(fullText);
    },
  });

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
      return;
    }
    speechInitialTextRef.current = currentComposerTextRef.current;
    await startListening(currentComposerTextRef.current);
  };

  const handleCancelListening = () => {
    abortListening(() => {
      composerChangeTextRef.current?.(speechInitialTextRef.current);
    });
  };

  const handleSend = async (newMsgs: IMessage[] = []) => {
    // Nothing goes to the AI until the user has agreed.
    if (aiConsent.status !== "granted") return;
    if (isListening) {
      stopListening();
    }
    const userMsg = newMsgs[0];
    if (!userMsg?.text) return;

    // Optimistic user bubble: show the message immediately so the user
    // doesn't wait on the API round-trip. The streaming hook also adds the
    // assistant placeholder below it.
    appendUserMessage(userMsg.text);

    // Open a streaming placeholder for the assistant reply BEFORE calling
    // the API, so the typing caret shows up at the same instant the user
    // message does.
    const handle = startStream({
      _id: `stream-${Date.now()}`,
      text: "",
      createdAt: new Date(),
      user: { _id: ASSISTANT_ID, name: "AI" },
      streaming: true,
    });

    // streamReply calls `sendChatMessage` (which persists the user message
    // and returns the AI reply), then drip-feeds the reply into the
    // placeholder. The user message is NOT pre-persisted here - the
    // single API call inside streamReply handles both sides of the
    // conversation. Invalidating the history query inside the streaming
    // hook's onSuccess makes the server's canonical version replace the
    // optimistic one without duplicating it.
    try {
      await streamReply(
        { message: userMsg.text },
        {
          replyId: handle.id,
          push: handle.push,
          set: handle.set,
          done: handle.done,
          signal: handle.signal,
        },
      );
    } catch (err: any) {
      // The streaming hook catches its own errors and surfaces them inside
      // the placeholder; this catch is only for truly unexpected throws.
      toast.error(err?.message ?? "Unable to send message right now.");
    }
  };

  /**
   * Insert the user's message at the top of the inverted list so it
   * appears immediately. The streaming hook's setMessages handles the
   * data-flow under the hood.
   */
  const appendUserMessage = (text: string) => {
    setMessages((prev) => [
      {
        _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        createdAt: new Date(),
        user: { _id: USER_ID, name: "You" },
        pending: true,
      } as IMessage,
      ...prev,
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Blocks the chat until the user agrees to AI data sharing. */}
      <AiConsentModal visible={aiConsent.status === "needed"} onAgree={aiConsent.grant} />
      <Chat<IMessage>
        messages={messages}
        onSend={handleSend}
        user={{ _id: USER_ID, name: "You" }}
        theme={chatTheme}
        enableKeyboardProvider={false}
        enableGestureHandlerRootView={false}
        // Hide the vertical scrollbar; Chat's FlatList forwards
        // `listProps` straight onto the underlying list component.
        listProps={{
          showsVerticalScrollIndicator: false,
          // Reserve space for the native-stack header + status bar so the
          // first message isn't drawn underneath the frosted blur.
          contentInset: { top: headerInset },
          contentOffset: { x: 0, y: -headerInset },
        }}
        // ---- customisation ----
        renderBubble={(bubbleProps) => (
          <ChatBubble<IMessage>
            {...bubbleProps}
            onStopStream={() => stopStream()}
          />
        )}
        renderAvatar={(avatarProps) => <ChatAvatar {...avatarProps} />}
        renderInputToolbar={(toolbarProps) => {
          const tp = toolbarProps as unknown as {
            text?: string;
            textInputProps?: { onChangeText?: (t: string) => void };
          };
          currentComposerTextRef.current = tp.text ?? "";
          composerChangeTextRef.current = tp.textInputProps?.onChangeText;

          return (
            <View
              style={{
                backgroundColor: Colors.white,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingHorizontal: 16,
                paddingBottom: 20,
                paddingTop: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              {isListening && (
                <SpeechListeningBanner
                  onStop={stopListening}
                  onCancel={handleCancelListening}
                />
              )}
              {/* Default InputToolbar would render: actions | composer | send.
                  We render only the composer + send to keep the layout clean
                  and avoid a hairline + white panel that reads as a second
                  input field stacked above the real one. */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: 10,
                }}
              >
                <ChatComposer
                  {...toolbarProps}
                  isListening={isListening}
                  onToggleListening={handleToggleListening}
                />
                <ChatSend
                  {...toolbarProps}
                  isStreaming={isStreaming}
                  onStopStream={() => stopStream()}
                />
              </View>
              <RNText
                variant="medium"
                size="xs"
                style={{ color: "#A09791", textAlign: "center", marginTop: 8 }}
              >
                AI companion, not a therapist. In a crisis, call or text 988.
              </RNText>
            </View>
          );
        }}
        renderLoadEarlier={() =>
          hasNextPage ? (
            <TouchableOpacity
              onPress={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              style={{
                alignSelf: "center",
                backgroundColor: "#E8DDD9",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                marginVertical: 12,
                opacity: isFetchingNextPage ? 0.7 : 1,
              }}
            >
              {isFetchingNextPage ? (
                <ActivityIndicator color={Colors.brown} />
              ) : (
                <RNText variant="medium" size="sm">
                  Load older
                </RNText>
              )}
            </TouchableOpacity>
          ) : null
        }
        renderChatEmpty={() =>
          isLoading ? (
            <ChatHistorySkeleton />
          ) : isError ? (
            <View style={{ alignItems: "center", marginTop: 30 }}>
              <RNText variant="medium" size="md" style={{ color: Colors.orange }}>
                Unable to load chat history.
              </RNText>
            </View>
          ) : (
            <EmptyState />
          )
        }
      />
    </View>
  );
};

export default ChatPage;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toIMessage(m: ChatHistoryMessage): IMessage {
  const text = m.message ?? (m as unknown as { text?: string }).text ?? "";
  return {
    _id: `${m.role}-${m.time}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    createdAt: new Date(m.time),
    user: {
      _id: m.role === "user" ? USER_ID : ASSISTANT_ID,
      name: m.role === "user" ? "You" : "AI",
    },
  };
}

function EmptyState() {
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 30,
        gap: 28,
        // The chat list is inverted (newest at the bottom), so its
        // ListEmptyComponent is rendered inside a flipped container. The
        // chat library normally counter-rotates bubble content but does
        // NOT do the same for the empty component — counter-rotate here
        // so the logo + text read right-side up.
        transform: [{ scaleY: -1 }],
      }}
    >
      <View
        style={{
          height: 240,
          width: 240,
          backgroundColor: Colors.yellow + "40",
          borderRadius: 9999,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ height: 220, width: 220 }}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 6,
          backgroundColor: Colors.orange + "40",
          borderRadius: 26,
        }}
      >
        <RNText variant="title" style={{ color: Colors.orange }}>
          YOUR AI COMPANION
        </RNText>
      </View>
      <View style={{ paddingHorizontal: 24, gap: 6 }}>
        <RNText variant="header" style={{ textAlign: "center" }}>
          Here to listen and help you reflect
        </RNText>
        <RNText style={{ textAlign: "center" }}>
          It can make mistakes and isn't a therapist or a crisis service. If you're in crisis,
          call or text 988.
        </RNText>
      </View>
    </View>
  );
}