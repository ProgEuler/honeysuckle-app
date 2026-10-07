import NativeHeaderBack from "@/components/ui/NativeHeaderBack";
import { HeaderProgressBadge } from "@/components/ui/HeaderProgressBadge";
import { Colors } from "@/constants/color";
import { Stack } from "expo-router";
import React from "react";

const DailyCheckLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                headerBlurEffect: "systemThinMaterial",
                headerLargeTitle: false,
                headerShadowVisible: false,
                headerTintColor: Colors.brown,
                headerBackButtonDisplayMode: "minimal",
                // Daily Check is a tab — there's no upstream route in this
                // stack, so the explicit back button isn't shown here.
                // headerLeft is omitted on purpose.
                title: "Assessment",
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerRight: () => <HeaderProgressBadge text="1 OF 3" />,
                }}
            />
        </Stack>
    );
};

export default DailyCheckLayout;