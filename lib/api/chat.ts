import { authenticatedApiRequest } from "./authenticatedClient";

export type ChatHistoryMessage = {
  role: "assistant" | "user" | string;
  message: string;
  time: string;
};

export type ChatHistoryResponse = {
  session_id: string;
  count: number;
  next: string | null;
  previous: string | null;
  messages: ChatHistoryMessage[];
};

type ChatHistoryParams = {
  page?: number;
  page_size?: number;
};

export type SendChatMessagePayload = {
  message: string;
};

export type SendChatMessageResponse = {
  role?: string;
  message?: string;
  reply?: string;
  time?: string;
};

export const getChatHistory = ({
  page = 1,
  page_size = 20,
}: ChatHistoryParams = {}) =>
  authenticatedApiRequest<ChatHistoryResponse>(
    `/api/chat/history/?page=${page}&page_size=${page_size}`,
    {
      method: "GET",
    },
  );

export const sendChatMessage = (payload: SendChatMessagePayload) =>
  authenticatedApiRequest<SendChatMessageResponse>("/api/chat/send/", {
    method: "POST",
    body: payload,
  });

export const clearChatHistory = () =>
  authenticatedApiRequest<{ status: boolean }>("/api/chat/clear/", {
    method: "DELETE",
  });
