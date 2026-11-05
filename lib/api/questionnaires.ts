import type { AssessmentAnswerValue, AssessmentQuestion } from "./assessment";
import { authenticatedApiRequest } from "./authenticatedClient";

/** A standalone questionnaire (e.g. PHQ-9) and whether it's due. */
export type QuestionnaireSummary = {
  key: string;
  name: string;
  description: string;
  frequency_days: number | null;
  last_completed_at: string | null;
  next_due_at: string | null;
  is_due: boolean;
};

export type SeverityBand = { min: number; max: number; label: string };

export type QuestionnaireDetail = {
  key: string;
  name: string;
  description: string;
  instructions: string;
  copyright_notice: string;
  scoring: "none" | "sum";
  severity_bands: SeverityBand[];
  questions: AssessmentQuestion[];
};

export type QuestionnaireResult = {
  id: string;
  questionnaire: string;
  total_score: number | null;
  severity: string;
  needs_safety_followup: boolean;
  created_at: string;
};

export type QuestionnaireAnswer = {
  question_id: string;
  answer: AssessmentAnswerValue;
};

/** A questionnaire's recent results (oldest first) for trend charts. */
export type QuestionnaireTrend = {
  key: string;
  name: string;
  max_score: number;
  severity_bands: SeverityBand[];
  results: { total_score: number | null; severity: string; created_at: string }[];
};

export const getQuestionnaireTrends = () =>
  authenticatedApiRequest<QuestionnaireTrend[]>("/api/assessments/trends/", { method: "GET" });

export const getQuestionnaires = () =>
  authenticatedApiRequest<QuestionnaireSummary[]>("/api/assessments/", { method: "GET" });

export const getQuestionnaire = (key: string) =>
  authenticatedApiRequest<QuestionnaireDetail>(`/api/assessments/${encodeURIComponent(key)}/`, {
    method: "GET",
  });

export const getQuestionnaireResults = (key: string) =>
  authenticatedApiRequest<QuestionnaireResult[]>(
    `/api/assessments/${encodeURIComponent(key)}/responses/`,
    { method: "GET" },
  );

export const submitQuestionnaire = ({ key, answers }: { key: string; answers: QuestionnaireAnswer[] }) =>
  authenticatedApiRequest<QuestionnaireResult>(
    `/api/assessments/${encodeURIComponent(key)}/responses/`,
    { method: "POST", body: { answers } },
  );
