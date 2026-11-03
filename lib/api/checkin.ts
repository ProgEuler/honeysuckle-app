import type { AssessmentAnswerValue } from "./assessment";
import { authenticatedApiRequest } from "./authenticatedClient";

export type CheckinAnswer = {
  question_id: string;
  answer: AssessmentAnswerValue;
};

export type CheckinPayload = {
  assesment: string;
  time: string;
  tags?: string[];
  answers?: CheckinAnswer[];
  journal: string;
};

export type CheckinResponse = {
  status?: boolean;
  message?: string;
  [key: string]: unknown;
};

export type JournalEntry = {
  id: string;
  assesment: string;
  time: string;
  tags?: string[];
  journal: string;
  score: number;
  user: string;
};

export type JournalEntriesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: JournalEntry[];
};

export const createCheckin = (payload: CheckinPayload) =>
  authenticatedApiRequest<CheckinResponse>("/api/checkin/", {
    method: "POST",
    body: payload,
  });

export const getJournalEntries = ({
  page = 1,
  page_size = 10,
}: { page?: number; page_size?: number } = {}) =>
  authenticatedApiRequest<JournalEntriesResponse>(
    `/api/entries/?page=${page}&page_size=${page_size}`,
    { method: "GET" },
  );
