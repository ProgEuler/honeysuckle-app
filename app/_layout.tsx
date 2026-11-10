import { Colors } from "@/constants/color";
import { useNotificationHook } from "@/hooks/usePushNotification";
import { useAuthStore } from "@/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { DefaultTheme, ThemeProvider, type Theme } from "@react-navigation/native";
import { Appearance, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Host } from "react-native-portalize";
import { Toaster } from "sonner-native";

// Keep native splash visible until we're ready
SplashScreen.preventAutoHideAsync();

// The app is light-only: ignore the device's dark mode so native views
// (tab bar, headers, screen backgrounds) never switch to dark colors.
Appearance.setColorScheme("light");

const LightTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.brown,
    background: Colors.background,
    card: Colors.white,
    text: Colors.brown,
    border: "#E8DDD9",
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // 2 minutes is the baseline; per-hook `staleTime` overrides win
      // when set higher (e.g. `useMeQuery` uses 5 minutes). This stops
      // every screen mount from immediately refetching the same data.
      staleTime: 1000 * 60 * 2,
      // Keep cached data for 10 minutes after the last subscriber unmounts
      // so a tab switch that briefly unmounts a screen doesn't refetch.
      gcTime: 1000 * 60 * 10,
      // Mobile apps don't have window-focus semantics; turning this off
      // prevents spurious refetches when the app returns from background.
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function RootLayout() {
  useNotificationHook();
  // Which screens exist depends on the session; see the Stack below.
  const isSignedIn = useAuthStore((state) => Boolean(state.accessToken && state.user));
  const hasAcceptedSession = useAuthStore((state) =>
    Boolean(state.accessToken && state.user?.policy),
  );
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
      if (Platform.OS === "android") {
        NavigationBar.setStyle("light");
      }
      // Hide native splash only after fonts are ready — no white flash
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // While fonts load, show the same dark background as step 1
  // so there's zero visible transition from native splash
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#2C1D14" }} />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Host>
          <KeyboardProvider>
            <StatusBar
              // barStyle="dark-content"
              style="dark"
              backgroundColor={Colors.background}
              // translucent={false}
            />
            <ThemeProvider value={LightTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="splash" options={{ animation: "none" }} />

                {/* Sign-in / sign-up: only while not fully signed in. When
                    someone signs in, these leave the history, so Back can't
                    return to them. */}
                <Stack.Protected guard={!hasAcceptedSession}>
                  <Stack.Screen name="auth" />
                  <Stack.Screen name="welcome/index" />
                  <Stack.Screen name="welcome/WelcomeRefactored" />
                </Stack.Protected>

                {/* Onboarding runs right after accepting the terms. */}
                <Stack.Protected guard={isSignedIn}>
                  <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
                </Stack.Protected>

                {/* The app itself: leaves the history on sign-out. */}
                <Stack.Protected guard={hasAcceptedSession}>
                  <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
                  <Stack.Screen name="dailycheck-sub-screens" />
                  <Stack.Screen name="settings-sub-screens" />
                  <Stack.Screen name="notifications/index" />
                  <Stack.Screen name="assessments" />
                </Stack.Protected>
              </Stack>
            </ThemeProvider>
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
          </KeyboardProvider>
        </Host>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
