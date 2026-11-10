import NativeHeaderBack from "@/components/ui/NativeHeaderBack";
import { HeaderProgressBadge } from "@/components/ui/HeaderProgressBadge";
import { Colors } from "@/constants/color";
import { Stack } from "expo-router";
import React from "react";

const DailyCheckSubScreensLayout = () => {
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
            }}
        >
            <Stack.Screen
                name="timestart"
                options={{
                    title: "Assessment",
                    headerRight: () => <HeaderProgressBadge text="2 OF 3" />,
                }}
            />
            <Stack.Screen name="journalhistory" options={{ title: "Journal entries" }} />
            {/* These screens draw their own header with a back button;
                without this the native header shows the route name. */}
            <Stack.Screen name="performance" options={{ headerShown: false }} />
            <Stack.Screen name="emotiontype" options={{ headerShown: false }} />
            <Stack.Screen
                name="journalentry"
                options={{
                    title: "Assessment",
                    headerRight: () => <HeaderProgressBadge text="3 OF 3" />,
                }}
            />
        </Stack>
    );
};

export default DailyCheckSubScreensLayout;