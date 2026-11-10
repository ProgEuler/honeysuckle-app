import Depressed from "@/assets/svgs/depressed.svg";
import Excellent from "@/assets/svgs/excellent.svg";
import Happy from "@/assets/svgs/happy.svg";
import Neutral from "@/assets/svgs/neutral.svg";
import Sad from "@/assets/svgs/sad.svg";

export type MoodOption = {
  label: string;
  icon: any;
};

export const moodOptions: MoodOption[] = [
  {
    label: "Excellent",
    icon: Excellent,
  },
  {
    label: "Good",
    icon: Happy,
  },
  {
    label: "Neutral",
    icon: Neutral,
  },
  {
    label: "Sad",
    icon: Sad,
  },
  {
    label: "Depressed",
    icon: Depressed,
  },
];

/** The mood for a 0–10 rating: same bands the server uses for its labels. */
export const moodForRating = (rating: number): MoodOption => {
  const [excellent, good, neutral, sad, depressed] = moodOptions;
  if (rating >= 8) return excellent;
  if (rating >= 6) return good;
  if (rating >= 4) return neutral;
  if (rating >= 2) return sad;
  return depressed;
};
