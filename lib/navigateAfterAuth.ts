import { AuthUserLog } from "@/lib/api/auth";
import { router } from "expo-router";

/**
 * After any successful auth (sign-in, social, OTP verify),
 * route the user based on whether they've accepted the policy/onboarding.
 */
export function navigateAfterAuth(user: AuthUserLog) {
  if (user.policy) {
    router.replace("/(tabs)/home");
  } else {
    router.replace("/auth/terms");
  }
}
