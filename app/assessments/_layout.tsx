import NativeHeaderBack from "@/components/ui/NativeHeaderBack";
import { Colors } from "@/constants/color";
import { Stack } from "expo-router";
import React from "react";

const AssessmentsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                headerBlurEffect: "systemThinMaterial",
                headerLargeTitle: false,
                headerShadowVisible: false,
                headerTintColor: Colors.brown,
                headerBackButtonDisplayMode: "minimal",
                headerLeft: () => <NativeHeaderBack />,
                title: "Questionnaire",
            }}
        />
    );
};

export default AssessmentsLayout;
