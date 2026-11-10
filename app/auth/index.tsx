import ArrowRight from "@/assets/svgs/arrowright.svg";
import Email from "@/assets/svgs/email.svg";
import Lock from "@/assets/svgs/lock.svg";
import InputForm from "@/components/inputform";
import SocialAuth from "@/components/shared/social-auth";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { signIn, SignInRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { navigateAfterSignIn } from "@/lib/navigateAfterAuth";
import { useAuthStore } from "@/store/useAuthStore";
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

const SignIn = () => {
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (payload: SignInRequest) => {
      const response = await signIn(payload);

      if (!response.status) {
        throw new Error("Unable to sign in with these credentials.");
      }
      return response;
    },
    onSuccess: (response) => {
      setAuthSession(response);
      toast.success("Signed in successfully.");
      navigateAfterSignIn(response.log);
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to sign in right now.";

      toast.error(message);
    },
  });

  const submitSignIn = (values: SignInRequest) => {
    signInMutation.mutate({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
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
            Sign in to Honeysuckle Trail
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
                placeHolder={"Enter your password"}
                control={control}
                errors={errors}
                Icon={Lock}
                autoCapitalize={"none"}
                secureTextEntry={!showPassword}
                textContentType="oneTimeCode"
                rules={{
                  required: "Password is required",
                }}
                rightElement={
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)} hitSlop={10}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={Colors.brown}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot")}
              style={styles.centerAlign}
            >
              <RNText variant="medium" size="md" style={styles.linkText}>
                Forgot password?
              </RNText>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={handleSubmit(submitSignIn)}
              disabled={signInMutation.isPending}
              style={[
                styles.submitButton,
                signInMutation.isPending
                  ? styles.submitButtonDisabled
                  : undefined,
              ]}
            >
              <RNText variant="title" size="lg" style={styles.submitButtonText}>
                {signInMutation.isPending ? "Signing In..." : "Sign In"}
              </RNText>
              {signInMutation.isPending ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <ArrowRight />
              )}
            </TouchableOpacity>
          </View>

          {/* social login buttons */}
          <SocialAuth />

          <View style={styles.centerRow}>
            <RNText variant="medium" size="md">
              Don't have an account?{" "}
            </RNText>
            <TouchableOpacity
              onPress={() => router.replace("/auth/signup")}
              style={styles.centerAlign}
              hitSlop={8}
            >
              <RNText variant="medium" size="md" style={styles.linkText}>
                Sign up
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  safeArea: {
    flex: 1,
    gap: 40,
    marginTop: 20,
    justifyContent: "space-between",
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
    marginBottom: 20,
  },
  formGroup: {
    gap: 10,
  },
  inputsGroup: {
    gap: 8,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  centerAlign: {},
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
