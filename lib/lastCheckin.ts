import type { JournalEntry } from "@/lib/api/checkin";

/**
 * The check-in that was just saved, for the "Saved" summary screen. In
 * memory only: the summary is shown once, right after saving.
 */
let lastSaved: JournalEntry | null = null;

export const setLastSavedCheckin = (entry: JournalEntry | null) => {
  lastSaved = entry;
};

export const getLastSavedCheckin = () => lastSaved;
