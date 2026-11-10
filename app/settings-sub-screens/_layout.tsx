import NativeHeaderBack from "@/components/ui/NativeHeaderBack";
import { Colors } from "@/constants/color";
import { Stack } from "expo-router";
import React from "react";

const SettingsSubScreensLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                headerBlurEffect: "systemThinMaterial",
                headerLargeTitle: false,
                headerShadowVisible: false,
                headerTintColor: Colors.brown,
                headerBackButtonDisplayMode: "minimal",
                // Explicit back button — these screens are reached from a tab
                // via `router.push`, so they live in a sibling native-stack
                // and the automatic one can be hidden on some iOS versions.
                headerLeft: () => <NativeHeaderBack />,
            }}
        >
            <Stack.Screen name="personalinfo" options={{ title: "Edit Personal Info" }} />
            <Stack.Screen name="invitefriends" options={{ title: "Invite Friends" }} />
            <Stack.Screen name="submitfeedback" options={{ title: "Submit Feedback" }} />
            <Stack.Screen name="reminder" options={{ title: "Daily Reminder" }} />
            <Stack.Screen name="security" options={{ title: "Security" }} />
            <Stack.Screen name="changepassword" options={{ title: "Change Password" }} />
            <Stack.Screen name="termsandpolicy" options={{ title: "Terms & Policy" }} />
        </Stack>
    );
};

export default SettingsSubScreensLayout;