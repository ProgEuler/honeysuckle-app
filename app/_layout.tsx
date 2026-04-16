import { useNotificationHook } from "@/hooks/usePushNotification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Host } from "react-native-portalize";
import { Toaster } from "sonner-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function RootLayout() {
   useNotificationHook()
  const [fontsLoaded] = useFonts({
    Thin: require("@/assets/fonts/Urbanist-Thin.ttf"),
    ExtraLight: require("@/assets/fonts/Urbanist-ExtraLight.ttf"),
    Light: require("@/assets/fonts/Urbanist-Light.ttf"),
    Regular: require("@/assets/fonts/Urbanist-Regular.ttf"),
    Medium: require("@/assets/fonts/Urbanist-Medium.ttf"),
    SemiBold: require("@/assets/fonts/Urbanist-SemiBold.ttf"),
    Bold: require("@/assets/fonts/Urbanist-Bold.ttf"),
    ExtraBold: require("@/assets/fonts/Urbanist-ExtraBold.ttf"),
    Black: require("@/assets/fonts/Urbanist-Black.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      NavigationBar.setStyle("light");
      console.log("All fonts loaded");
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Host>
          <KeyboardProvider>
            {/* <ClerkProvider tokenCache={tokenCache}> */}
            <StatusBar
              barStyle="dark-content"
              backgroundColor={"transparent"}
            />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  backgroundColor: "#FFFFFF",
                  borderRadius: 24,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: "#F0EBE7",
                },
                titleStyle: {
                  fontFamily: "SemiBold",
                  fontSize: 14,
                  color: "#4B3425",
                },
                descriptionStyle: {
                  fontFamily: "Regular",
                  textAlign: "center",
                  fontSize: 13,
                  color: "#6D6661",
                },
              }}
            />
            {/* </ClerkProvider> */}
          </KeyboardProvider>
        </Host>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
