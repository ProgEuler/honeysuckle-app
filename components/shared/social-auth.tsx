import Apple from "@/assets/svgs/apple.svg";
import Google from "@/assets/svgs/google.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useAppleSignIn } from "@/hooks/useAppleSignIn";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { socialLogin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { navigateAfterAuth } from "@/lib/navigateAfterAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";
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
    if (socialLoginMutation.isPending) return;
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
    if (socialLoginMutation.isPending) return;
    try {
      const user = await signInWithApple();
      if (!user) return;
      const idToken = await user.getIdToken(true);
      await socialLoginMutation.mutateAsync(idToken);
    } catch {
      toast.error("Apple sign-in failed. Please try again.");
    }
  };

  const isLoading = isGoogleLoading || isAppleLoading || socialLoginMutation.isPending;

  return (
    <>
      <Modal visible={isLoading} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={Colors.brown} />
            <RNText variant="medium" size="md" style={styles.loaderText}>
              Signing you in...
            </RNText>
          </View>
        </View>
      </Modal>

      <View style={styles.socialButtonsRow}>
        <Pressable
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          style={styles.socialButton}
        >
          <Google />
        </Pressable>
        <Pressable
          onPress={handleAppleSignIn}
          disabled={isLoading}
          style={styles.socialButton}
        >
          <Apple />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  loaderText: {
    color: Colors.brown,
  },
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
