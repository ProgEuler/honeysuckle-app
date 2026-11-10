import { isStartupComplete } from "@/lib/appStartup";
import { useAuthStore } from "@/store/useAuthStore";
import { Redirect } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

/**
 * Start route. The router also comes back here whenever the session changes
 * and the current screen stops being available (sign-in, sign-out; see the
 * protected groups in app/_layout.tsx), so it routes by session.
 */
export default function Index() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  // App launch: the splash checks the saved session first.
  if (!isStartupComplete()) {
    return <Redirect href="/splash" />;
  }
  if (!accessToken || !user) {
    return <Redirect href="/auth" />;
  }
  return <Redirect href={user.policy ? "/(tabs)/home" : "/auth/terms"} />;
}
