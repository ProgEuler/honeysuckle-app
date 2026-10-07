import { useNavigation } from "@react-navigation/native";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import React from "react";

import { OnboardingStepView } from "@/components/onboarding/OnboardingStepView";
import { ONBOARDING_STEPS } from "@/constants/onboardingSteps";
import { WelcomeTabParamList } from "@/constants/onboarding";

type Navigation = MaterialTopTabNavigationProp<WelcomeTabParamList>;

export default function StepThreeScreen() {
    const navigation = useNavigation<Navigation>();

    return (
        <OnboardingStepView
            title={ONBOARDING_STEPS[2].title}
            stepLabel={ONBOARDING_STEPS[2].step}
            coloredWords={ONBOARDING_STEPS[2].coloredWords}
            color={ONBOARDING_STEPS[2].color}
            image={ONBOARDING_STEPS[2].image}
            onNext={() => navigation.navigate("StepFour")}
        />
    );
}
