import ArrowRight from "@/assets/svgs/arrowright.svg";
import { BackButton } from "@/components/ui/BackButton";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { verifyOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const ForgotOtp = () => {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [otpCode, setOtpCode] = useState("");
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  const email =
    typeof emailParam === "string" ? emailParam.trim().toLowerCase() : "";

  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: { email: string; otp_code: string }) => {
      const response = await verifyOtp(payload);

      if (response.status === false) {
        throw new Error(response.message || "Invalid OTP code.");
      }

      return response;
    },
    onSuccess: (response) => {
      if (response.access && response.refresh && response.log) {
        setAuthSession({
          status: response.status ?? true,
          access: response.access,
          refresh: response.refresh,
          log: response.log,
        });
      }

      toast.success("OTP verified successfully.");
      router.push({
        pathname: "/auth/newpassword",
        params: { email },
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to verify OTP right now.";

      toast.error(message);
    },
  });

  const handleVerifyOtp = () => {
    if (!email) {
      toast.error("Missing email. Please start again.");
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

  const disableVerify = verifyOtpMutation.isPending || otpCode.length !== 4;

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <View style={styles.backgroundCircle} />
      <BackButton style={styles.backButton} onPress={() => router.back()} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.mainContent}>
          <View style={styles.headerContent}>
            <RNText variant="title" size="3xl" style={styles.titleText}>
              Enter 4 digit OTP Code
            </RNText>
            <RNText variant="base" size="lg" style={styles.subtitleText}>
              We’ve sent a 4-digit verification code to your Email. Enter the
              code below to proceed.
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
            <RNText variant="medium" size="lg">
              {" "}
              Didn't receive the code?{" "}
            </RNText>
            <TouchableOpacity
              // onPress={() => router.replace('/auth')}
              style={styles.centerAlign}
            >
              <RNText variant="medium" size="lg" style={styles.linkText}>
                Resend.
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default ForgotOtp;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  backgroundCircle: {
    backgroundColor: Colors.green,
    width: 960,
    height: 960,
    position: "absolute",
    top: -750,
    left: "50%",
    marginLeft: -480,
    borderRadius: 1234,
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 24,
    zIndex: 20,
    elevation: 20,
  },
  safeArea: {
    flex: 1,
    marginTop: 30,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 60,
    width: 60,
  },
  mainContent: {
    width: "90%",
    marginHorizontal: "auto",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    marginTop: 120,
  },
  headerContent: {
    gap: 20,
    width: "90%",
    marginHorizontal: "auto",
  },
  titleText: {
    textAlign: "center",
  },
  subtitleText: {
    textAlign: "center",
    marginBottom: 20,
    width: "90%",
    marginHorizontal: "auto",
  },
  fullWidth: {
    width: "100%",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  centerAlign: {
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: Colors.orange,
    textDecorationLine: "underline",
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
    color: Colors.white,
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
