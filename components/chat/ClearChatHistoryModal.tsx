import AppDialog from "@/components/ui/AppDialog";
import {
  chatHistoryQueryKey,
} from "@/hooks/useChatHistoryQuery";
import { clearChatHistory } from "@/lib/api/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

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
    <AppDialog
      visible={props.visible}
      title="Clear chat history?"
      message="This permanently deletes all your messages. This can't be undone."
      confirmLabel="Clear"
      destructive
      loading={mutation.isPending}
      onCancel={props.onCancel}
      onConfirm={() => mutation.mutate()}
    />
  );
};

export default ClearChatHistoryModal;
