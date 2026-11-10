import ArrowRight from "@/assets/svgs/arrowright.svg";
import Back from "@/assets/svgs/back.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { getOtp, verifyOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { navigateAfterAuth } from "@/lib/navigateAfterAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const Otp = () => {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [otpCode, setOtpCode] = useState("");

  const email =
    typeof emailParam === "string" ? emailParam.trim().toLowerCase() : "";

  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: { email: string; otp_code: string }) => {
      const response = await verifyOtp(payload);

      if (response.status === false) {
        throw new Error(response.message || "Invalid OTP code.");
      }

      return response;
    },
    onSuccess: (response) => {
      toast.success("OTP verified successfully.");
      if (response.access && response.refresh && response.log) {
        setAuthSession({
          status: true,
          access: response.access,
          refresh: response.refresh,
          log: response.log,
        });
        navigateAfterAuth(response.log);
      } else {
        // fallback: no session in response, send to terms/onboarding
        router.replace("/auth/terms");
      }
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to verify OTP right now.";

      toast.error(message);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await getOtp(payload);

      if (response.status === false) {
        throw new Error(response.message || "Unable to resend OTP.");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("OTP sent again.");
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to resend OTP right now.";

      toast.error(message);
    },
  });

  const handleVerifyOtp = () => {
    if (!email) {
      toast.error("Missing email. Please sign up again.");
      return;
    }

    if (otpCode.length !== 4) {
      toast.error("Please enter the 4-digit OTP code.");
      return;
    }

    verifyOtpMutation.mutate({
      email,
      otp_code: otpCode,
    });
  };

  const handleResendOtp = () => {
    if (!email) {
      toast.error("Missing email. Please sign up again.");
      return;
    }

    if (resendOtpMutation.isPending) {
      return;
    }

    resendOtpMutation.mutate({ email });
  };

  const disableVerify = verifyOtpMutation.isPending || otpCode.length !== 4;

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Back />
          </TouchableOpacity>
          <RNText variant="title" size="xl">
            OTP Setup
          </RNText>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.headerContent}>
            <RNText variant="title" size="2xl" style={styles.titleText}>
              Enter 4 digit OTP Code
            </RNText>
            <RNText variant="medium" size="md" style={styles.subtitleText}>
              We’ve sent a 4-digit verification code to your email. Enter the
              code below to proceed{email ? ` for ${email}` : ""}.
            </RNText>
          </View>
          <View>
            <OtpInput
              numberOfDigits={4}
              autoFocus={false}
              focusStickBlinkingDuration={500}
              type="numeric"
              onTextChange={setOtpCode}
              onFilled={setOtpCode}
              theme={{
                pinCodeContainerStyle: styles.pinCodeContainer,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                containerStyle: styles.container,
                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
              }}
            />
          </View>
          <View style={styles.fullWidth}>
            <TouchableOpacity
              onPress={handleVerifyOtp}
              disabled={disableVerify}
              style={[
                styles.continueButton,
                disableVerify ? styles.continueButtonDisabled : null,
              ]}
            >
              <RNText
                variant="title"
                size="lg"
                style={styles.continueButtonText}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Continue"}
              </RNText>
              {verifyOtpMutation.isPending ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <ArrowRight />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.footerRow}>
            <RNText variant="subtitle" size="sm">
              Didn't receive the code?
            </RNText>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendOtpMutation.isPending}
            >
              <RNText variant="subtitle" size="sm" style={styles.linkText}>
                {resendOtpMutation.isPending ? "Resending..." : "Resend."}
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.brown,
    alignItems: "flex-start",
    borderRadius: 40,
  },
  mainContent: {
    width: "90%",
    marginHorizontal: "auto",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    marginTop: -100,
  },
  headerContent: {
    width: "95%",
    marginHorizontal: "auto",
    gap: 20,
  },
  titleText: {
    textAlign: "center",
  },
  subtitleText: {
    textAlign: "center",
    lineHeight: 30,
  },
  fullWidth: {
    width: "100%",
  },
  footerRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
  linkText: {
    textDecorationLine: "underline",
    color: Colors.orange,
  },
  container: {
    padding: 10,
  },
  pinCodeContainer: {
    borderColor: Colors.green,
    width: 75,
    height: 105,
    backgroundColor: Colors.white,
    borderRadius: 50,
  },
  pinCodeText: {
    color: Colors.brown,
    fontFamily: "ExtraBold",
    fontSize: 50,
  },
  focusStick: {
    backgroundColor: Colors.green,
  },
  filledPinCodeContainer: {
    borderColor: Colors.green,
    backgroundColor: Colors.green,
  },
  activePinCodeContainer: {
    borderColor: Colors.green,
  },
  continueButton: {
    backgroundColor: Colors.brown,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    gap: 15,
    borderRadius: 30,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: Colors.white,
  },
});
