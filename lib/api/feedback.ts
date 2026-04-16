import { authenticatedApiRequest } from "./authenticatedClient";

export type FeedbackPayload = {
  feedback: string;
  stars: number;
};

export type FeedbackResponse = {
  status?: boolean;
  message?: string;
  [key: string]: unknown;
};

export const createFeedback = (payload: FeedbackPayload) =>
  authenticatedApiRequest<FeedbackResponse>("/api/feedback/", {
    method: "POST",
    body: payload,
  });
