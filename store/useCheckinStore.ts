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
  setMood: (moodLabel: string) => void;
  setTime: (time: string) => void;
  setJournal: (journal: string) => void;
  resetCheckin: () => void;
}

export const useCheckinStore = create<CheckinState>((set) => ({
  selectedMoodLabel: null,
  assesment: "",
  time: "",
  journal: "",
  setMood: (moodLabel) =>
    set({
      selectedMoodLabel: moodLabel,
      assesment: normalizeAssessment(moodLabel),
    }),
  setTime: (time) => set({ time }),
  setJournal: (journal) => set({ journal }),
  resetCheckin: () =>
    set({
      selectedMoodLabel: null,
      assesment: "",
      time: "",
      journal: "",
    }),
}));
