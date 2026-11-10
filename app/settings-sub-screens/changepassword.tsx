import Back from "@/assets/svgs/back.svg";
import { Layout } from "@/components/layout/Layout";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { changePassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { toast } from "sonner-native";

const ChangePassword = () => {
  const { bottom } = useSafeAreaInsets();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: async (payload: { old_password: string; password: string }) => {
      const response = await changePassword(payload);

      if (response.status === false) {
        throw new Error(response.message || "Unable to change password.");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      router.back();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to change password right now.";

      toast.error(message);
    },
  });

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Use at least 8 characters for your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword === oldPassword) {
      toast.error("New password must not match old password");
      return;
    }

    changePasswordMutation.mutate({
      old_password: oldPassword,
      password: newPassword,
    });
  };

  return (
    <Layout edges={["top"]} style={[styles.container, { paddingBottom: bottom }]}>
        <View style={styles.inputContainer}>
          <RNText variant="medium" size="sm" style={styles.label}>
            Old Password
          </RNText>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter old password"
              placeholderTextColor={Colors.primaryText}
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity
              onPress={() => setShowOldPassword((prev) => !prev)}
              hitSlop={10}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showOldPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.brown}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <RNText variant="medium" size="sm" style={styles.label}>
            New Password
          </RNText>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="At least 8 characters"
              placeholderTextColor={Colors.primaryText}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword((prev) => !prev)}
              hitSlop={10}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.brown}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <RNText variant="medium" size="sm" style={styles.label}>
            Confirm New Password
          </RNText>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm new password"
              placeholderTextColor={Colors.primaryText}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              hitSlop={10}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.brown}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            changePasswordMutation.isPending
              ? styles.submitButtonDisabled
              : null,
          ]}
          onPress={handleChangePassword}
          disabled={changePasswordMutation.isPending}
        >
          {changePasswordMutation.isPending ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <RNText variant="title" size="lg" style={styles.submitText}>
              Update Password
            </RNText>
          )}
        </TouchableOpacity>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 64,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginLeft: 20,
    marginTop: 12,
  },
  backButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.brown,
    alignItems: "flex-start",
    borderRadius: 40,
  },
  headerTitle: {
    color: Colors.brown,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: Colors.brown,
    marginLeft: 4,
  },
  inputWrapper: {
    width: "100%",
    height: 56,
    backgroundColor: Colors.white,
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.brown,
    fontFamily: "PoppinsRegular",
  },
  eyeButton: {
    marginLeft: 8,
    padding: 8,
  },
  submitButton: {
    width: "100%",
    height: 64,
    backgroundColor: Colors.brown,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitText: {
    color: Colors.white,
    marginTop: 2,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});

export default ChangePassword;
