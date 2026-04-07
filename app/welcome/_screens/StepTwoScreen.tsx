import { useNavigation } from "@react-navigation/native";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import React from "react";

import { OnboardingStepView } from "../_components/OnboardingStepView";
import { ONBOARDING_STEPS } from "../_data";
import { WelcomeTabParamList } from "../_types";

type Navigation = MaterialTopTabNavigationProp<WelcomeTabParamList>;

export default function StepTwoScreen() {
    const navigation = useNavigation<Navigation>();

    return (
        <OnboardingStepView
            title={ONBOARDING_STEPS[1].title}
            stepLabel={ONBOARDING_STEPS[1].step}
            coloredWords={ONBOARDING_STEPS[1].coloredWords}
            color={ONBOARDING_STEPS[1].color}
            image={ONBOARDING_STEPS[1].image}
            onNext={() => navigation.navigate("StepThree")}
        />
    );
}
