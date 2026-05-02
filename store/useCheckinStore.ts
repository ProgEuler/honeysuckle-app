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
  setMood: (moodLabel: string) => void;
  setTime: (time: string) => void;
  setJournal: (journal: string) => void;
  setTags: (tags: string[]) => void;
  resetCheckin: () => void;
}

export const useCheckinStore = create<CheckinState>((set) => ({
  selectedMoodLabel: null,
  assesment: "",
  time: "",
  journal: "",
  tags: [],
  setMood: (moodLabel) =>
    set({
      selectedMoodLabel: moodLabel,
      assesment: normalizeAssessment(moodLabel),
    }),
  setTime: (time) => set({ time }),
  setJournal: (journal) => set({ journal }),
  setTags: (tags) => set({ tags }),
  resetCheckin: () =>
    set({
      selectedMoodLabel: null,
      assesment: "",
      time: "",
      journal: "",
      tags: [],
    }),
}));
