import Back from '@/assets/svgs/back.svg';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubmitFeedback = () => {
  const [feedback, setFeedback] = useState('');

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

      <ScrollView contentContainerStyle={styles.content}>
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
          style={[styles.submitButton, !feedback.trim() && styles.submitButtonDisabled]}
          onPress={() => {
            if (feedback.trim()) {
              // Submit feedback logic here
              router.back();
            }
          }}
          disabled={!feedback.trim()}
        >
          <RNText variant="title" size="lg" style={styles.submitText}>
            Submit
          </RNText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.brown,
    alignItems: 'flex-start',
    borderRadius: 40,
  },
  headerTitle: {
    color: Colors.brown,
    marginTop: 2,
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
    width: '100%',
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
    fontFamily: 'PoppinsRegular',
  },
  submitButton: {
    width: '100%',
    height: 64,
    backgroundColor: Colors.brown,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
