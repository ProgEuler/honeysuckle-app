import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import {
  chatHistoryQueryKey,
} from "@/hooks/useChatHistoryQuery";
import { clearChatHistory } from "@/lib/api/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Confirmation modal for wiping chat history. Lives in `chatpages/_layout.tsx`
 * so the native-header menu button and the modal can share state without
 * prop-drilling through the chat screen.
 */
export const ClearChatHistoryModal = (props: {
  visible: boolean;
  onCancel: () => void;
  onCleared: () => void;
  pageSize?: number;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: clearChatHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatHistoryQueryKey(props.pageSize ?? 20),
      });
      props.onCleared();
      toast.success("Chat history cleared.");
    },
    onError: () => {
      toast.error("Failed to clear chat history.");
    },
  });

  return (
    <Modal
      visible={props.visible}
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
            onPress={() => mutation.mutate()}
            disabled={mutation.isPending}
            style={{
              backgroundColor: Colors.orange,
              paddingVertical: 14,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              opacity: mutation.isPending ? 0.7 : 1,
            }}
          >
            {mutation.isPending ? (
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
            onPress={props.onCancel}
            disabled={mutation.isPending}
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
  );
};

export default ClearChatHistoryModal;