import ArrowRight from '@/assets/svgs/arrowright.svg';
import Depressed from '@/assets/svgs/depressed.svg';
import Excellent from '@/assets/svgs/excellent.svg';
import Happy from '@/assets/svgs/happy.svg';
import Neutral from '@/assets/svgs/neutral.svg';
import Sad from '@/assets/svgs/sad.svg';
import { BackButton } from '@/components/ui/BackButton';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const moods = [
  { label: 'Excellent', Icon: Excellent },
  { label: 'Good', Icon: Happy },
  { label: 'Fair', Icon: Neutral },
  { label: 'Poor', Icon: Sad },
  { label: 'Worst', Icon: Depressed },
];

const First = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [anxiety, setAnxiety] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton style={{ marginBottom: 10 }} />
        <View style={styles.header}>
          <RNText variant="medium" size="sm" style={{ color: Colors.green }}>Step 01 · Daily Check-In</RNText>
          <View style={styles.titleContainer}>
            <RNText variant="title" size="4xl" style={styles.titleText}>How are you</RNText>
            <RNText variant="title" size="4xl" style={[styles.titleText, { color: Colors.green }]}>Feeling today?</RNText>
          </View>
          <RNText variant="medium" size="md" style={styles.description}>
            Pick the mood that fits right now. A quick daily tap helps you notice patterns over time.
          </RNText>
        </View>

        <View style={styles.moodsContainer}>
          {moods.map(({ label, Icon }) => (
            <TouchableOpacity
              key={label}
              onPress={() => setSelectedMood(label)}
              style={[
                styles.moodItem,
                selectedMood === label && styles.selectedMoodItem,
              ]}
            >
              <View style={styles.moodIconContainer}>
                <Icon width={24} height={24} />
              </View>
              <RNText variant="medium" size="xs" style={styles.moodLabel}>{label}</RNText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.questionsContainer}>
          <RNText variant="medium" size="md" style={styles.questionLabel}>Quick questions</RNText>

          <View style={styles.questionSection}>
            <RNText variant="header" size="md" style={styles.questionTitle}>How's your anxiety?</RNText>
            <View style={styles.buttonGroup}>
              {['Low', 'Medium', 'High'].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setAnxiety(option)}
                  style={[
                    styles.groupButton,
                    anxiety === option && styles.selectedGroupButton,
                  ]}
                >
                  <RNText
                    variant="medium"
                    size="sm"
                    style={[
                      styles.groupButtonText,
                      anxiety === option && styles.selectedGroupButtonText,
                    ]}
                  >
                    {option}
                  </RNText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.questionSection}>
            <RNText variant="header" size="md" style={styles.questionTitle}>Sleep quality?</RNText>
            <View style={styles.buttonGroup}>
              {['Poor', 'Okay', 'Great'].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSleep(option)}
                  style={[
                    styles.groupButton,
                    sleep === option && styles.selectedGroupButton,
                  ]}
                >
                  <RNText
                    variant="medium"
                    size="sm"
                    style={[
                      styles.groupButtonText,
                      sleep === option && styles.selectedGroupButtonText,
                    ]}
                  >
                    {option}
                  </RNText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/onboarding/second')}
          style={styles.continueButton}
        >
          <RNText variant="header" size="lg" style={styles.continueButtonText}>Continue</RNText>
          <ArrowRight fill={Colors.white} />
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 32,
  },
  header: {
    gap: 8,
  },
  titleContainer: {
    marginTop: 4,
  },
  titleText: {
    lineHeight: 44,
  },
  description: {
    color: '#6D6661',
    lineHeight: 24,
    marginTop: 8,
  },
  moodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodItem: {
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0DD',
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal: 4,
  },
  selectedMoodItem: {
    borderColor: Colors.green,
    backgroundColor: '#F1F5E9',
  },
  moodIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodLabel: {
    color: '#6D6661',
  },
  questionsContainer: {
    gap: 20,
  },
  questionLabel: {
    color: Colors.green,
  },
  questionSection: {
    gap: 12,
  },
  questionTitle: {
    color: Colors.brown,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  groupButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.green,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  selectedGroupButton: {
    backgroundColor: Colors.brown,
    borderColor: Colors.brown,
  },
  groupButtonText: {
    color: Colors.brown,
  },
  selectedGroupButtonText: {
    color: Colors.white,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.brown,
    paddingVertical: 18,
    borderRadius: 100,
    marginTop: 10,
  },
  continueButtonText: {
    color: Colors.white,
  },
});

export default First;

