import Depressed from '@/assets/svgs/depressed.svg';
import Excellent from '@/assets/svgs/excellent.svg';
import Happy from '@/assets/svgs/happy.svg';
import Neutral from '@/assets/svgs/neutral.svg';
import Sad from '@/assets/svgs/sad.svg';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const moods = [
  { label: 'Excellent', Icon: Excellent },
  { label: 'Good', Icon: Happy },
  { label: 'Neutral', Icon: Neutral },
  { label: 'Sad', Icon: Sad },
  { label: 'Depressed', Icon: Depressed },
];

const questions = [
  { title: "How's your anxiety?", options: ['Low', 'Medium', 'High'] },
  { title: 'Sleep quality?', options: ['Poor', 'Okay', 'Great'] },
];

const First = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <OnboardingScreen
      step="Step 01 · Daily Check-In"
      title={['How are you', 'feeling today?']}
      description="Pick the mood that fits right now. A quick daily tap helps you notice patterns over time."
      action={{ label: 'Continue', onPress: () => router.push('/onboarding/second') }}
    >
      <View style={styles.moods}>
        {moods.map(({ label, Icon }) => {
          const active = selectedMood === label;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setSelectedMood(label)}
              style={[styles.mood, active && styles.moodActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
            >
              <Icon width={26} height={26} />
              <RNText variant="medium" size="xs" style={styles.moodLabel} numberOfLines={1} adjustsFontSizeToFit>
                {label}
              </RNText>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.questions}>
        <RNText variant="medium" size="md" style={{ color: Colors.green }}>Quick questions</RNText>
        {questions.map((question) => (
          <View key={question.title} style={styles.question}>
            <RNText variant="header" size="md">{question.title}</RNText>
            <View style={styles.options}>
              {question.options.map((option) => {
                const active = answers[question.title] === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setAnswers((prev) => ({ ...prev, [question.title]: option }))}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <RNText variant="medium" size="sm" style={{ color: active ? Colors.white : Colors.brown }}>
                      {option}
                    </RNText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </OnboardingScreen>
  );
};

const styles = StyleSheet.create({
  moods: { flexDirection: 'row', gap: 6 },
  mood: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0DD',
    backgroundColor: Colors.white,
  },
  moodActive: { borderColor: Colors.green, backgroundColor: '#F1F5E9' },
  moodLabel: { color: Colors.primaryText },
  questions: { gap: 18 },
  question: { gap: 10 },
  options: { flexDirection: 'row', gap: 10 },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.green,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  optionActive: { backgroundColor: Colors.brown, borderColor: Colors.brown },
});

export default First;
