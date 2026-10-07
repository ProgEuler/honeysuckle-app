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
    label: "Happy",
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
