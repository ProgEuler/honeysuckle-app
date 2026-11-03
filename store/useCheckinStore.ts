import type { AssessmentAnswerValue } from "@/lib/api/assessment";
import { create } from "zustand";

const moodToAssessmentMap: Record<string, string> = {
  Excellent: "good",
  Happy: "good",
  Neutral: "neutral",
  Sad: "sad",
  Depressed: "depressed",
};

const normalizeAssessment = (moodLabel: string) =>
  moodToAssessmentMap[moodLabel] ?? moodLabel.trim().toLowerCase();

interface CheckinState {
  selectedMoodLabel: string | null;
  assesment: string;
  time: string;
  journal: string;
  tags: string[];
  /** Answers to the admin-managed questions, keyed by question id. */
  answers: Record<string, AssessmentAnswerValue>;
  setMood: (moodLabel: string) => void;
  setTime: (time: string) => void;
  setJournal: (journal: string) => void;
  setTags: (tags: string[]) => void;
  setAnswer: (questionId: string, answer: AssessmentAnswerValue) => void;
  resetCheckin: () => void;
}

export const useCheckinStore = create<CheckinState>((set) => ({
  selectedMoodLabel: null,
  assesment: "",
  time: "",
  journal: "",
  tags: [],
  answers: {},
  setMood: (moodLabel) =>
    set({
      selectedMoodLabel: moodLabel,
      assesment: normalizeAssessment(moodLabel),
    }),
  setTime: (time) => set({ time }),
  setJournal: (journal) => set({ journal }),
  setTags: (tags) => set({ tags }),
  setAnswer: (questionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  resetCheckin: () =>
    set({
      selectedMoodLabel: null,
      assesment: "",
      time: "",
      journal: "",
      tags: [],
      answers: {},
    }),
}));
