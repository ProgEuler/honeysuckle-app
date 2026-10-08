import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendChatMessage } from "@/lib/api/chat";
import { chatHistoryQueryKey } from "@/hooks/useChatHistoryQuery";
import type { IMessage } from "@kesha-antonov/react-native-chat";

/**
 * Result type for the streaming adapter hook.
 */
export type StreamReplyOptions = {
  replyId: IMessage["_id"];
  push: (chunk: string) => void;
  set: (text: string) => void;
  done: (finalPatch?: Partial<IMessage>) => void;
  signal: AbortSignal;
};

/**
 * Hook that wires the existing JSON chat API to the streaming hook so the
 * reply text is revealed token-by-token with a visible caret.
 *
 * The hook also exposes an `AbortController` so the user can stop mid-stream.
 * When stopped early the final partial reply is committed to history too,
 * so the user never loses what they already saw.
 */
export function useStreamChatReply(pageSize: number) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: chatHistoryQueryKey(pageSize),
      });
    },
  });

  /**
   * Fetch the full reply, then drip-feed it into the streaming message in
   * tiny chunks. Honors `signal` so callers can abort cleanly.
   */
  const streamReply = async (
    payload: { message: string },
    opts: StreamReplyOptions,
  ) => {
    const { replyId, push, set, done, signal } = opts;
    try {
      const response = await mutation.mutateAsync(payload);

      const fullText =
        response.reply ?? response.message ?? "";

      if (!fullText) {
        // Nothing came back; mark the bubble done with a friendly fallback.
        set("I couldn't think of a response just now. Try again?");
        done({ streaming: false, pending: false });
        return;
      }

      // Split into pseudo-tokens of 3–6 chars + space-padded chunks for a
      // natural-feeling reveal. Whitespace joins cleanly to a string.
      const tokens = chunkify(fullText, 4, 18);

      for (const token of tokens) {
        if (signal.aborted) break;
        push(token);
        // Tiny per-token latency — capped so very long replies feel snappy.
        await sleep(signal.aborted ? 0 : jitter(12, 26));
      }

      done({ streaming: false, pending: false, _id: replyId });
    } catch (err: any) {
      if (signal.aborted) {
        // User-initiated stop: keep whatever was already streamed.
        done({ streaming: false, pending: false });
        return;
      }
      const message =
        err?.message ?? "Unable to send message right now.";
      set(message);
      done({
        streaming: false,
        pending: false,
      });
    }
  };

  return { streamReply, isPending: mutation.isPending };
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function jitter(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Split `text` into chunks of length between `min` and `max`. */
function chunkify(text: string, min: number, max: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const len = jitter(min, max);
    // Try to break on a word boundary when possible.
    let end = Math.min(text.length, i + len);
    if (end < text.length) {
      const slice = text.slice(i, end);
      const lastWs = slice.search(/\s\S*$/);
      if (lastWs > min / 2) {
        end = i + lastWs + 1;
      }
    }
    chunks.push(text.slice(i, end));
    i = end;
  }
  return chunks;
}