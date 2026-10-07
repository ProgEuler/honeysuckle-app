import { Colors } from "@/constants/color";
import { Stack } from "expo-router";
import React from "react";

const AnalyticsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                headerBlurEffect: "systemThinMaterial",
                headerLargeTitle: false,
                headerShadowVisible: false,
                headerTintColor: Colors.brown,
                title: "Analytics",
            }}
        />
    );
};

export default AnalyticsLayout;