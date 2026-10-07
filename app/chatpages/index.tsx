import Back from "@/assets/svgs/back.svg";
import Enter from "@/assets/svgs/enter.svg";
import Menu from "@/assets/svgs/menu.svg";
import Type from "@/assets/svgs/type.svg";
import ChatHistorySkeleton from "@/components/skeletons/screens/ChatHistorySkeleton";
import { Boticon } from "@/components/icons/boticon";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import {
  chatHistoryQueryKey,
  useChatHistoryQuery,
} from "@/hooks/useChatHistoryQuery";
import { useKeyboardVisibility } from "@/hooks/useKeyborad";
import {
  ChatHistoryMessage,
  clearChatHistory,
  sendChatMessage,
} from "@/lib/api/chat";
import { ApiError } from "@/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { User2 } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const ChatPage = () => {
  const keyboardVisibility = useKeyboardVisibility();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const pageSize = 20;
  const [showClearModal, setShowClearModal] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatHistoryQuery(pageSize);

  const clearChatMutation = useMutation({
    mutationFn: clearChatHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatHistoryQueryKey(pageSize),
      });
      setShowClearModal(false);
      toast.success("Chat history cleared.");
    },
    onError: () => {
      toast.error("Failed to clear chat history.");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: async () => {
      setInputMessage("");
      await queryClient.invalidateQueries({
        queryKey: chatHistoryQueryKey(pageSize),
      });
      flatListRef.current?.scrollToEnd({ animated: true });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to send message right now.";
      toast.error(message);
    },
  });

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (!message || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({ message });
  };

  const canSend =
    inputMessage.trim().length > 0 && !sendMessageMutation.isPending;

  const messages = useMemo(() => {
    if (!data?.pages) return [];
    // API returns latest first; render oldest-to-newest
    return [...data.pages]
      .reverse()
      .flatMap((page) => [...page.messages].reverse());
  }, [data?.pages]);

  const formatMessageTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderItem = useCallback(({ item }: { item: ChatHistoryMessage }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={{
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: 8,
          marginBottom: 15,
        }}
      >
        {isUser ? (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.brown,
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User2 color="#BFA79A" width={18} height={18} />
          </View>
        ) : (
          <Boticon size={32} />
        )}

        <View
          style={{ alignItems: isUser ? "flex-end" : "flex-start", flex: 1 }}
        >
          <RNText
            variant="medium"
            size="md"
            style={{
              backgroundColor: isUser ? Colors.brown : "#E8DDD9",
              paddingVertical: 10,
              paddingHorizontal: 18,
              maxWidth: "90%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: isUser ? 20 : 6,
              borderBottomRightRadius: isUser ? 6 : 20,
              color: isUser ? Colors.white : Colors.brown,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {item.message}
          </RNText>
          <RNText
            variant="base"
            size="xs"
            style={{
              marginTop: 4,
              color: Colors.primaryText,
              marginRight: isUser ? 2 : 0,
              marginLeft: isUser ? 0 : 2,
            }}
          >
            {formatMessageTime(item.time)}
          </RNText>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback(
    (item: ChatHistoryMessage, index: number) => `${item.time}-${index}`,
    [],
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <SafeAreaView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: Colors.white,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          paddingHorizontal: 15,
          paddingBottom: -20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            paddingTop: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: Colors.brown,
              alignItems: "flex-start",
              borderRadius: 40,
            }}
          >
            <Back />
          </TouchableOpacity>
          <RNText variant="title" size="xl">
            Chat with AI
          </RNText>
        </View>
        <TouchableOpacity
          onPress={() => setShowClearModal(true)}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.brown,
            borderRadius: 50,
          }}
        >
          <Menu />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Clear chat modal */}
      <Modal
        visible={showClearModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 28,
              padding: 28,
              width: "82%",
              gap: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <RNText variant="title" size="xl" style={{ textAlign: "center" }}>
              Clear Chat History
            </RNText>
            <RNText
              variant="medium"
              size="md"
              style={{
                textAlign: "center",
                color: Colors.primaryText,
                lineHeight: 24,
              }}
            >
              This will permanently delete all your messages. This action cannot
              be undone.
            </RNText>
            <TouchableOpacity
              onPress={() => clearChatMutation.mutate()}
              disabled={clearChatMutation.isPending}
              style={{
                backgroundColor: Colors.orange,
                paddingVertical: 14,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                opacity: clearChatMutation.isPending ? 0.7 : 1,
              }}
            >
              {clearChatMutation.isPending ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <RNText
                  variant="title"
                  size="lg"
                  style={{ color: Colors.white }}
                >
                  Clear History
                </RNText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowClearModal(false)}
              disabled={clearChatMutation.isPending}
              style={{
                paddingVertical: 14,
                borderRadius: 30,
                alignItems: "center",
                borderWidth: 1,
                borderColor: Colors.brown,
              }}
            >
              <RNText variant="title" size="lg">
                Cancel
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListHeaderComponent={
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
                  marginBottom: 12,
                  opacity: isFetchingNextPage ? 0.7 : 1,
                }}
              >
                <RNText variant="medium" size="sm">
                  {isFetchingNextPage
                    ? "Loading older messages..."
                    : "Load older"}
                </RNText>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            isLoading ? (
              <ChatHistorySkeleton />
            ) : isError ? (
              <View style={{ alignItems: "center", marginTop: 30 }}>
                <RNText
                  variant="medium"
                  size="md"
                  style={{ color: Colors.orange }}
                >
                  Unable to load chat history.
                </RNText>
              </View>
            ) : (
              <View style={{ alignItems: "center", marginTop: 30, gap: 28 }}>
                {/* <Boticon size={56} />
                <RNText variant="medium" size="md">
                  No messages yet. Start your first chat.
                </RNText> */}
                <View
                  style={{
                    height: 240,
                    width: 240,
                    backgroundColor: Colors.yellow + 40,
                    borderRadius: "50%",
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
                    backgroundColor: Colors.orange + 40,
                    borderRadius: 26,
                  }}
                >
                  <RNText variant="title" style={{ color: Colors.orange }}>
                    LIMITATIONS
                  </RNText>
                </View>
                <View>
                  <RNText variant="header" style={{ textAlign: "center" }}>
                    Limited Knowledge
                  </RNText>
                  <RNText>No human being is perfect. So is chatbots.</RNText>
                </View>
              </View>
            )
          }
        />

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            backgroundColor: Colors.white,
            paddingHorizontal: 20,
            paddingBottom: keyboardVisibility ? 15 : 40,
            paddingTop: 20,
            gap: 30,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: Colors.green,
              borderRadius: 30,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: Colors.background,
            }}
          >
            <Type />
            <TextInput
              placeholder="Type to start chatting..."
              placeholderTextColor={Colors.primaryText}
              autoCorrect={false}
              autoCapitalize="sentences"
              spellCheck={false}
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              editable={!sendMessageMutation.isPending}
              style={{
                flex: 1,
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderRadius: 10,
                fontSize: 16,
                fontFamily: "PoppinsRegular",
                backgroundColor: Colors.background,
                color: Colors.brown,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!canSend}
            style={{
              backgroundColor: Colors.green,
              alignSelf: "flex-start",
              padding: 12,
              borderRadius: 100,
              opacity: canSend ? 1 : 0.6,
            }}
          >
            {sendMessageMutation.isPending ? (
              <ActivityIndicator color={Colors.brown} />
            ) : (
              <Enter />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatPage;
