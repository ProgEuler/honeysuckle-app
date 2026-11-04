import type { AssessmentAnswerValue } from "@/lib/api/assessment";
import { create } from "zustand";

export type SleepQuality = "poor" | "okay" | "good" | "great";

interface CheckinState {
  moodRating: number | null;
  anxietyRating: number | null;
  sleepHours: number | null;
  sleepQuality: SleepQuality | null;
  journal: string;
  tags: string[];
  /** Answers to the admin-managed questions, keyed by question id. */
  answers: Record<string, AssessmentAnswerValue>;
  setMoodRating: (rating: number) => void;
  setAnxietyRating: (rating: number) => void;
  setSleepHours: (hours: number) => void;
  setSleepQuality: (quality: SleepQuality) => void;
  setJournal: (journal: string) => void;
  setTags: (tags: string[]) => void;
  setAnswer: (questionId: string, answer: AssessmentAnswerValue) => void;
  resetCheckin: () => void;
}

const initialState = {
  moodRating: null,
  anxietyRating: null,
  sleepHours: null,
  sleepQuality: null,
  journal: "",
  tags: [],
  answers: {},
};

export const useCheckinStore = create<CheckinState>((set) => ({
  ...initialState,
  setMoodRating: (moodRating) => set({ moodRating }),
  setAnxietyRating: (anxietyRating) => set({ anxietyRating }),
  setSleepHours: (sleepHours) => set({ sleepHours }),
  setSleepQuality: (sleepQuality) => set({ sleepQuality }),
  setJournal: (journal) => set({ journal }),
  setTags: (tags) => set({ tags }),
  setAnswer: (questionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  resetCheckin: () => set(initialState),
}));
