import { AuthUserLog } from "@/lib/api/auth";
import { router } from "expo-router";

/**
 * From the splash (app launch with a saved session): go to the app, or to
 * the terms if they haven't been accepted yet.
 */
export function navigateAfterAuth(user: AuthUserLog) {
  if (user.policy) {
    router.replace("/(tabs)/home");
  } else {
    router.replace("/auth/terms");
  }
}

/**
 * Right after signing in on an auth screen (password, Google, Apple, email
 * code), once the session is saved. If the terms are already accepted, the
 * protected routes in app/_layout.tsx drop the auth screens from history and
 * the start route opens Home; navigating here as well would race that.
 * Otherwise the auth screens stay available and we go to the terms.
 */
export function navigateAfterSignIn(user: AuthUserLog) {
  if (!user.policy) {
    router.replace("/auth/terms");
  }
}
