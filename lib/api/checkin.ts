import type { AssessmentAnswerValue } from "./assessment";
import { authenticatedApiRequest } from "./authenticatedClient";

export type CheckinAnswer = {
  question_id: string;
  answer: AssessmentAnswerValue;
};

export type CheckinPayload = {
  check_in_type: "quick" | "detailed";
  mood_rating: number;
  anxiety_rating: number;
  sleep_hours?: number;
  sleep_quality?: "poor" | "okay" | "good" | "great";
  tags?: string[];
  answers?: CheckinAnswer[];
  journal?: string;
};

export type CheckinResponse = {
  status?: boolean;
  message?: string;
  [key: string]: unknown;
};

export type JournalEntry = {
  id: string;
  check_in_type?: "quick" | "detailed";
  assesment: string;
  mood_rating?: number | null;
  anxiety_rating?: number | null;
  sleep_hours?: string | null;
  sleep_quality?: string;
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
