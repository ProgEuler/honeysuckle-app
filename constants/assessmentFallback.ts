import type { AssessmentQuestion } from "@/lib/api/assessment";

/**
 * Shown when the admin-managed questions can't be loaded (offline, server
 * error), so the check-in still works. Answers to these are only saved as
 * tags, never sent as `answers`, since the server doesn't know their ids.
 */
export const FALLBACK_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "fallback-mood-factors",
    text: "What may be affecting your mood today?",
    help_text: "",
    question_type: "multiple_choice",
    is_required: true,
    saves_as_tags: true,
    options: [
      "Sleep",
      "Work/School",
      "Relationships",
      "Health",
      "Money",
      "Family",
      "Loneliness",
      "Stress",
      "Not sure",
      "Other",
    ].map((label) => ({ id: label, label })),
  },
];
