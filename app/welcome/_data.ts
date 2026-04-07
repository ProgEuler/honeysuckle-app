import { Colors } from "@/constants/color";
import { ImageSourcePropType } from "react-native";

export type OnboardingStep = {
    id: number;
    tabTitle: string;
    step: string;
    title: string;
    coloredWords: string[];
    image: ImageSourcePropType;
    color: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 1,
        tabTitle: "Step 1",
        step: "STEP 1",
        title: "Personalize Your Mental Health State With AI",
        coloredWords: ["State"],
        image: require("@/assets/images/welcome-1st.png"),
        color: Colors.green,
    },
    {
        id: 2,
        tabTitle: "Step 2",
        step: "STEP 2",
        title: "Intelligent Mood Tracking & Emotion Insights",
        coloredWords: ["Intelligent"],
        image: require("@/assets/images/welcome-2nd.png"),
        color: Colors.orange,
    },
    {
        id: 3,
        tabTitle: "Step 3",
        step: "STEP 3",
        title: "Mindful Resources That Makes You Happy",
        coloredWords: ["Resources"],
        image: require("@/assets/images/welcome-3rd.png"),
        color: Colors.yellow,
    },
    {
        id: 4,
        tabTitle: "Step 4",
        step: "STEP 4",
        title: "Loving & Supportive Community",
        coloredWords: ["Community"],
        image: require("@/assets/images/welcome-4th.png"),
        color: Colors.purple,
    },
];
