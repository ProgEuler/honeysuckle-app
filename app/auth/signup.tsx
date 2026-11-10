import ArrowRight from "@/assets/svgs/arrowright.svg";
import Email from "@/assets/svgs/email.svg";
import Lock from "@/assets/svgs/lock.svg";
import InputForm from "@/components/inputform";
import SocialAuth from "@/components/shared/social-auth";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { getOtp, signUp, SignUpRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const SignUp = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpRequest>({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });
  const [isChecked, setChecked] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValue = watch("password");

  const signUpMutation = useMutation({
    mutationFn: async (payload: SignUpRequest) => {
      const signUpResponse = await signUp(payload);

      if (signUpResponse.status === false) {
        throw new Error(signUpResponse.message || "Unable to sign up.");
      }

      const otpResponse = await getOtp({ email: payload.email });

      if (otpResponse.status === false) {
        throw new Error(otpResponse.message || "Couldn't send the verification code.");
      }

      return { email: payload.email };
    },
    onSuccess: ({ email }) => {
      toast.success("Account created. Check your email for a code.");
      router.push({
        pathname: "/auth/otp",
        params: { email },
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to sign up right now.";

      toast.error(message);
    },
  });

  const submitSignUp = (values: SignUpRequest) => {
    // if (!isChecked) {
    //   toast.error("Please accept Terms & Conditions to continue.");
    //   return;
    // }

    signUpMutation.mutate({
      email: values.email.trim().toLowerCase(),
      password: values.password,
      confirm_password: values.confirm_password,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
      // scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backgroundCircle} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.formWrapper}>
          <RNText variant="title" size="2xl" style={styles.title}>
            Create your account
          </RNText>

          <View style={styles.formGroup}>
            <View style={styles.inputsGroup}>
              <InputForm
                title={"email"}
                label={"Email Address"}
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
              <InputForm
                title={"password"}
                label={"Password"}
                placeHolder={"At least 8 characters"}
                control={control}
                errors={errors}
                Icon={Lock}
                autoCapitalize={"none"}
                secureTextEntry={!showNewPassword}
                textContentType="oneTimeCode"
                rules={{
                  required: "Password is required",
                  minLength: { value: 8, message: "Use at least 8 characters" },
                }}
                rightElement={
                  <TouchableOpacity onPress={() => setShowNewPassword((p) => !p)} hitSlop={10}>
                    <Ionicons
                      name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={Colors.brown}
                    />
                  </TouchableOpacity>
                }
              />
              <InputForm
                title={"confirm_password"}
                label={"Confirm Password"}
                placeHolder={"Confirm your password"}
                control={control}
                errors={errors}
                Icon={Lock}
                autoCapitalize={"none"}
                secureTextEntry={!showConfirmPassword}
                textContentType="oneTimeCode"
                rules={{
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                }}
                rightElement={
                  <TouchableOpacity onPress={() => setShowConfirmPassword((p) => !p)} hitSlop={10}>
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={Colors.brown}
                    />
                  </TouchableOpacity>
                }
              />
            </View>

            {/* <View style={styles.termsRow}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
                color={Colors.green}
              />
              <RNText variant="medium">I Agree with the</RNText>
              <TouchableOpacity
                onPress={() => router.push("/auth/terms")}
                style={styles.inlineLinkWrap}
              >
                <RNText variant="medium" style={styles.termsLink}>
                  Terms & Conditions
                </RNText>
              </TouchableOpacity>
            </View> */}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(submitSignUp)}
            disabled={signUpMutation.isPending}
            style={[
              styles.submitButton,
              signUpMutation.isPending
                ? styles.submitButtonDisabled
                : undefined,
            ]}
          >
            <RNText variant="title" size="lg" style={styles.submitButtonText}>
              {signUpMutation.isPending ? "Creating account..." : "Sign up"}
            </RNText>
            {signUpMutation.isPending ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <ArrowRight />
            )}
          </TouchableOpacity>

          {/* social auth */}
          <SocialAuth />

          <View style={styles.centerRow}>
            <RNText variant="medium" size="md">
              Already have an account?{" "}
            </RNText>
            <TouchableOpacity
              onPress={() => router.replace("/auth")}
              style={styles.centerAlign}
              hitSlop={8}
            >
              <RNText variant="medium" size="md" style={styles.linkText}>
                Sign in
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;

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
  safeArea: {
    flex: 1,
    gap: 40,
    //  marginTop: 20,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 120,
    width: 120,
  },
  formWrapper: {
    width: "90%",
    marginHorizontal: "auto",
    alignSelf: "center",
    gap: 30,
  },
  title: {
    textAlign: "center",
    //  marginBottom: 20,
  },
  formGroup: {
    gap: 10,
  },
  inputsGroup: {
    gap: 8,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
    borderRadius: 10,
  },
  termsLink: {
    color: Colors.green,
    textDecorationLine: "underline",
  },
  inlineLinkWrap: {
    alignSelf: "center",
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    //  marginVertical: 10,
  },
  socialButton: {
    height: 56,
    width: 56,
    backgroundColor: "#E8DDD9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  centerAlign: {
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: Colors.orange,
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: Colors.brown,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    gap: 15,
    borderRadius: 30,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
  },
});
