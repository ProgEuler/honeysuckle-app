import { router } from "expo-router";
import React from "react";

import { OnboardingStepView } from "../_components/OnboardingStepView";
import { ONBOARDING_STEPS } from "../_data";

export default function StepFourScreen() {
    return (
        <OnboardingStepView
            title={ONBOARDING_STEPS[3].title}
            stepLabel={ONBOARDING_STEPS[3].step}
            coloredWords={ONBOARDING_STEPS[3].coloredWords}
            color={ONBOARDING_STEPS[3].color}
            image={ONBOARDING_STEPS[3].image}
            buttonLabel="Get Started"
            onNext={() => router.push("/auth")}
        />
    );
}
