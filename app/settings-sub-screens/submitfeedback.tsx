import Back from "@/assets/svgs/back.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { ApiError } from "@/lib/api/client";
import { createFeedback } from "@/lib/api/feedback";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
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

const SubmitFeedback = () => {
  const { bottom } = useSafeAreaInsets();
  const [feedback, setFeedback] = useState("");
  const stars = 5.5;

  const feedbackMutation = useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      toast.success("Thanks for your feedback.");
      setFeedback("");
      router.back();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to submit feedback right now.";

      toast.error(message);
    },
  });

  const handleSubmitFeedback = () => {
    const trimmedFeedback = feedback.trim();

    if (!trimmedFeedback || feedbackMutation.isPending) {
      return;
    }

    feedbackMutation.mutate({
      feedback: trimmedFeedback,
      stars,
    });
  };

  const isSubmitDisabled = !feedback.trim() || feedbackMutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl" style={styles.headerTitle}>
          Submit Feedback
        </RNText>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
        scrollEnabled={false}
      >
        <RNText variant="medium" size="lg" style={styles.description}>
          We'd love to hear your thoughts. How can we improve your experience?
        </RNText>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Type your feedback here..."
            placeholderTextColor={Colors.primaryText}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitDisabled && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitFeedback}
          disabled={isSubmitDisabled}
        >
          {feedbackMutation.isPending ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <RNText variant="title" size="lg" style={styles.submitText}>
              Submit
            </RNText>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    gap: 24,
  },
  description: {
    color: Colors.brown,
    lineHeight: 24,
  },
  inputContainer: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.white,
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.brown,
    fontFamily: "PoppinsRegular",
  },
  submitButton: {
    width: "100%",
    height: 64,
    backgroundColor: Colors.brown,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: Colors.white,
    marginTop: 2,
  },
});

export default SubmitFeedback;
