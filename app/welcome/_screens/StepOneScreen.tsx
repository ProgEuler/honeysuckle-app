import { useNavigation } from "@react-navigation/native";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import React from "react";

import { OnboardingStepView } from "../_components/OnboardingStepView";
import { ONBOARDING_STEPS } from "../_data";
import { WelcomeTabParamList } from "../_types";

type Navigation = MaterialTopTabNavigationProp<WelcomeTabParamList>;

export default function StepOneScreen() {
    const navigation = useNavigation<Navigation>();

    return (
        <OnboardingStepView
            title={ONBOARDING_STEPS[0].title}
            stepLabel={ONBOARDING_STEPS[0].step}
            coloredWords={ONBOARDING_STEPS[0].coloredWords}
            color={ONBOARDING_STEPS[0].color}
            image={ONBOARDING_STEPS[0].image}
            onNext={() => navigation.navigate("StepTwo")}
        />
    );
}
