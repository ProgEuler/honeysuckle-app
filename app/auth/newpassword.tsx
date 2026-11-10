import Lock from "@/assets/svgs/lock.svg";
import InputForm from "@/components/inputform";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

type NewPasswordForm = {
  password: string;
  confirmPassword: string;
};

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPasswordForm>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const email =
    typeof emailParam === "string" ? emailParam.trim().toLowerCase() : "";

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: { email: string; new_password: string }) => {
      const response = await resetPassword(payload);

      if (response.status === false) {
        throw new Error(response.message || "Unable to reset password.");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Password reset successfully. Please sign in.");
      router.replace("/auth");
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to reset password right now.";

      toast.error(message);
    },
  });

  const handleResetPassword = (values: NewPasswordForm) => {
    if (!email) {
      toast.error("Missing email. Please restart forgot password flow.");
      return;
    }
    if(values.password !== values.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (resetPasswordMutation.isPending) {
      return;
    }

    resetPasswordMutation.mutate({
      email,
      new_password: values.password,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
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
          <View style={styles.titleGroup}>
            <RNText variant="title" size="3xl" style={styles.titleText}>
              Create New Password
            </RNText>
            <RNText variant="base" size="lg" style={styles.subtitleText}>
              Your new password must be unique from those previously used.
            </RNText>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.inputsGroup}>
              <InputForm
                title={"password"}
                label={"Password"}
                placeHolder={"Enter your password"}
                control={control}
                errors={errors}
                Icon={Lock}
                autoCapitalize={"none"}
                secureTextEntry={!showPassword}
                rightElement={
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color={Colors.brown}
                    />
                  </TouchableOpacity>
                }
                rules={{
                  required: "Password is required",
                }}
              />
              <InputForm
                title={"confirmPassword"}
                label={"Confirm Password"}
                placeHolder={"Confirm Password"}
                control={control}
                errors={errors}
                Icon={Lock}
                autoCapitalize={"none"}
                secureTextEntry={!showConfirmPassword}
                rightElement={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={22}
                      color={Colors.brown}
                    />
                  </TouchableOpacity>
                }
                rules={{
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                }}
              />
            </View>
          </View>

          <View style={styles.buttonWrap}>
            <RNButton
              value={resetPasswordMutation.isPending ? "Saving..." : "Save"}
              onPress={handleSubmit(handleResetPassword)}
              disabled={resetPasswordMutation.isPending}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default NewPassword;

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
    gap: 80,
    marginTop: 20,
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
    gap: 20,
  },
  titleGroup: {
    gap: 10,
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
  buttonWrap: {
    marginTop: 20,
  },
});
