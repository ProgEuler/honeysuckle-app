import Apple from "@/assets/svgs/apple.svg";
import Google from "@/assets/svgs/google.svg";
import { useAppleSignIn } from "@/hooks/useAppleSignIn";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { socialLogin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { navigateAfterAuth } from "@/lib/navigateAfterAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { Pressable, StyleSheet, View } from "react-native";
import { toast } from "sonner-native";

export default function SocialAuth() {
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn();
  const { signInWithApple, isLoading: isAppleLoading } = useAppleSignIn();
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  const socialLoginMutation = useMutation({
    mutationFn: socialLogin,
    onSuccess: (response) => {
      setAuthSession(response);
      toast.success("Signed in successfully.");
      navigateAfterAuth(response.log);
      console.log("socail rse: ", response)
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to sign in with social account right now.";

      toast.error(message);
    },
  });

  const handleGoogleSignIn = async () => {
    if (socialLoginMutation.isPending) {
      return;
    }

    try {
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken(true);
      await socialLoginMutation.mutateAsync(idToken);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleAppleSignIn = async () => {
    if (socialLoginMutation.isPending) {
      return;
    }

    try {
      const user = await signInWithApple();
      if (!user) {
        return;
      }

      const idToken = await user.getIdToken(true);
      await socialLoginMutation.mutateAsync(idToken);
    } catch {
      toast.error("Apple sign-in failed. Please try again.");
    }
  };

  const disableSocialButtons =
    isGoogleLoading || isAppleLoading || socialLoginMutation.isPending;
  return (
    <View style={styles.socialButtonsRow}>
      <Pressable
        onPress={handleGoogleSignIn}
        disabled={disableSocialButtons}
        style={styles.socialButton}
      >
        <Google />
      </Pressable>
      <Pressable
        onPress={handleAppleSignIn}
        disabled={disableSocialButtons}
        style={styles.socialButton}
      >
        <Apple />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    marginVertical: 10,
  },
  socialButton: {
    height: 56,
    width: 56,
    backgroundColor: "#E8DDD9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
});
