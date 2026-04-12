import { useAuthStore } from "@/store/useAuthStore";
import { Redirect } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.user);
   console.log("User authentication status:", isAuthenticated);
  if (isAuthenticated) {
    return <Redirect href={"/(tabs)/home"} />;
  }

  return <Redirect href={"/welcome"} />;
}
