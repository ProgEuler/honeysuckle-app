import { authenticatedApiRequest } from "./authenticatedClient";

export type AssessmentQuestionType = "single_choice" | "multiple_choice" | "text";

export type AssessmentOption = {
  id: string;
  label: string;
};

export type AssessmentQuestion = {
  id: string;
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
