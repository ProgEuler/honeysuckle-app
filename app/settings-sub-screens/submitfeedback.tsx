import { Layout } from "@/components/layout/Layout";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { ApiError } from "@/lib/api/client";
import { createFeedback } from "@/lib/api/feedback";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Star } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const RATING_LABELS = ["", "Not great", "Could be better", "It's okay", "Good", "Love it"];

const SubmitFeedback = () => {
  const { bottom } = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const feedbackMutation = useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      toast.success("Thanks for your feedback.");
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

  const handleRate = (value: number) => {
    Haptics.selectionAsync().catch(() => {});
    setRating(value);
  };

  const handleSubmitFeedback = () => {
    if (!rating || feedbackMutation.isPending) {
      return;
    }

    feedbackMutation.mutate({
      feedback: feedback.trim(),
      stars: rating,
    });
  };

  const isSubmitDisabled = !rating || feedbackMutation.isPending;

  return (
    <Layout edges={["top"]} style={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.card}>
        <RNText variant="header" size="lg" style={styles.center}>
          How's your experience with Honeysuckle Trail?
        </RNText>
        <View style={styles.stars} accessibilityRole="adjustable" accessibilityLabel="Rating">
          {[1, 2, 3, 4, 5].map((value) => {
            const filled = value <= rating;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => handleRate(value)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                accessibilityRole="radio"
                accessibilityState={{ checked: rating === value }}
                accessibilityLabel={`${value} star${value === 1 ? "" : "s"}`}
              >
                <Star
                  size={36}
                  color={filled ? Colors.yellow : "#D9CFC9"}
                  fill={filled ? Colors.yellow : "transparent"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <RNText variant="medium" size="sm" style={[styles.center, styles.muted]}>
          {rating ? RATING_LABELS[rating] : "Tap a star to rate"}
        </RNText>
      </View>

      <View style={styles.commentBlock}>
        <RNText variant="header" size="md">
          Anything we could do better?{" "}
          <RNText variant="medium" size="sm" style={styles.muted}>
            (optional)
          </RNText>
        </RNText>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            maxLength={2000}
            placeholder="Tell us what you like or what's missing…"
            placeholderTextColor="#A09791"
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
        onPress={handleSubmitFeedback}
        disabled={isSubmitDisabled}
        accessibilityRole="button"
      >
        {feedbackMutation.isPending ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <RNText variant="title" size="lg" style={styles.submitText}>
            Send feedback
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  center: { textAlign: "center" },
  muted: { color: Colors.primaryText },
  stars: { flexDirection: "row", justifyContent: "center", gap: 10 },
  commentBlock: { gap: 10, marginTop: 20 },
  inputContainer: {
    width: "100%",
    height: 160,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.brown,
    fontFamily: "Regular",
  },
  submitButton: {
    width: "100%",
    minHeight: 56,
    backgroundColor: Colors.brown,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: Colors.white,
  },
});

export default SubmitFeedback;
