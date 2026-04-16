import Email from "@/assets/svgs/email.svg";
import InputForm from "@/components/inputform";
import { BackButton } from "@/components/ui/BackButton";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { getOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

type ForgotForm = {
  email: string;
};

const Forgot = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    defaultValues: {
      email: "",
    },
  });

  const getOtpMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await getOtp(payload);

      if (response.status === false) {
        throw new Error(response.message || "Unable to send OTP.");
      }

      return payload.email;
    },
    onSuccess: (email) => {
      toast.success("OTP sent to your email.");
      router.push({
        pathname: "/auth/forgototp",
        params: { email },
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to send OTP right now.";

      toast.error(message);
    },
  });

  const handleSendOtp = (values: ForgotForm) => {
    if (getOtpMutation.isPending) {
      return;
    }

    getOtpMutation.mutate({
      email: values.email.trim().toLowerCase(),
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
      scrollEnabled={false}
    >
      <View style={styles.backgroundCircle} />
      <BackButton
        style={styles.backButton}
        onPress={() => router.replace("/auth")}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.formWrapper}>
          <View style={styles.titleGroup}>
            <RNText variant="title" size="3xl" style={styles.titleText}>
              Forgot Password
            </RNText>
            <RNText variant="base" size="lg" style={styles.subtitleText}>
              Don't worry! Please enter the email address linked with your
              account.
            </RNText>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.inputsGroup}>
              <InputForm
                title={"email"}
                label={"Enter Your Email Address"}
                placeHolder={"abc@email.com"}
                control={control}
                errors={errors}
                Icon={Email}
                keyboardType={"email-address"}
                autoCapitalize={"none"}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                }}
              />
            </View>
          </View>

          <RNButton
            value={getOtpMutation.isPending ? "Sending..." : "Send"}
            onPress={handleSubmit(handleSendOtp)}
            disabled={getOtpMutation.isPending}
          />

          <View style={styles.footerRow}>
            <RNText variant="medium" size="lg">
              {" "}
              Remember Password?{" "}
            </RNText>
            <TouchableOpacity
              onPress={() => router.replace("/auth")}
              style={styles.centerAlign}
            >
              <RNText variant="medium" size="lg" style={styles.linkText}>
                Sign In.
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  container: {
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
    gap: 80,
    marginTop: 20,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 60,
    width: 60,
  },
  formWrapper: {
    width: "90%",
    marginHorizontal: "auto",
    alignSelf: "center",
    gap: 40,
  },
  titleGroup: {
    gap: 20,
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
  formGroup: {
    gap: 10,
  },
  inputsGroup: {
    gap: 20,
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
});
