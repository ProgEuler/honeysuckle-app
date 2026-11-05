import { authenticatedApiRequest } from "./authenticatedClient";

/** "scale" is a scored single choice (e.g. PHQ-9 items); it renders like single_choice. */
export type AssessmentQuestionType = "single_choice" | "multiple_choice" | "scale" | "text";

export type AssessmentOption = {
  id: string;
  label: string;
  value?: number | null;
};

export type AssessmentQuestion = {
  id: string;
  key?: string;
  version?: number;
  text: string;
  help_text: string;
  question_type: AssessmentQuestionType;
  is_required: boolean;
  saves_as_tags: boolean;
  options: AssessmentOption[];
};

export type AssessmentAnswerValue = string | string[];

export const getAssessmentQuestions = () =>
  authenticatedApiRequest<AssessmentQuestion[]>("/api/assessment/questions/", {
    method: "GET",
  });
