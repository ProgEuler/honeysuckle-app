import auth from "@react-native-firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import { useState } from "react";
import { Platform } from "react-native";
import { toast } from "sonner-native";

export function useAppleSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const appleAuthSupported = async () => {
    if (Platform.OS === "ios") {
      try {
        return await AppleAuthentication.isAvailableAsync();
      } catch (e) {
        return false;
      }
    }

    // In this app setup (Expo + RNFirebase native auth), Apple sign-in is only
    // supported with the iOS native AppleAuthentication flow.
    return false;
  };

  const signInWithApple = async () => {
    console.log("Starting Apple Sign-In...");
    setIsLoading(true);

    try {
      if (Platform.OS === "ios") {
        // Request Apple Sign-In without a manual nonce to avoid expo-crypto dependency
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        if (!credential.identityToken) {
          throw new Error("No Identity Token received from Apple");
        }

        // Create Firebase credential using just the identity token
        const firebaseCredential = auth.AppleAuthProvider.credential(
          credential.identityToken,
        );

        const userCredential =
          await auth().signInWithCredential(firebaseCredential);
        console.log("Apple Sign-In Success on iOS");
        const user = userCredential.user;

        // Apple's token has no name, and Apple gives the name only on the
        // very first sign-in. Save it on the Firebase user so the refreshed
        // ID token (which our backend reads) carries it, like Google's does.
        const fullName = [
          credential.fullName?.givenName,
          credential.fullName?.familyName,
        ]
          .filter(Boolean)
          .join(" ")
          .trim();
        if (fullName && !user.displayName) {
          try {
            await user.updateProfile({ displayName: fullName });
          } catch (e) {
            console.warn("Couldn't save Apple name to Firebase:", e);
          }
        }
        return user;
      } else {
        // auth().signInWithProvider is not available in this RNFirebase runtime.
        toast.error("Apple sign-in is currently available on iOS only.");
        return null;
      }
    } catch (error: any) {
      // Handle common cancellation codes
      if (
        error.code === "ERR_CANCELED" ||
        error.message?.toLowerCase().includes("cancel")
      ) {
        console.log("User canceled Apple Sign-In");
        toast.error("Apple sign-in cancelled. Please try again.");
      } else {
        console.error("Apple Sign-In Error: ", error);
        throw error;
      }
    } finally {
      setIsLoading(false);
    }

    return null;
  };

  return { signInWithApple, appleAuthSupported, isLoading };
}
