import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { AlertCircle, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const prompts = [
  {
    question: 'What patterns do you notice this week?',
    answer: 'Your mood dips mid-week (Wednesday) consistently over the past 3 weeks. Your anxiety spikes correlate with lower sleep scores. Consider protecting Wednesday evenings.',
  },
  {
    question: 'What might be triggering my anxiety?',
    answer: 'Based on your entries, work-related stress and lack of sleep usually precede your anxiety spikes. Try to prioritize rest and mindful breaks.',
  },
  {
    question: 'Give me 3 evidence-based tools.',
    answer: '1. 4-7-8 Breathing Technique\n2. Progressive Muscle Relaxation\n3. Cognitive Restructuring Exercises',
  },
  {
    question: 'Summarize my last 7 days.',
    answer: 'You started the week feeling overwhelmed but gradually improved. You engaged in 3 positive activities and logged 4 journal entries over the weekend.',
  },
];

const Fifth = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <OnboardingScreen
      step="Step 05 · AI Support"
      title={['Your AI', 'support companion']}
      description="It looks at your check-ins and journal notes together, then suggests a few ideas you can try. Tap a prompt to see an example."
      action={{ label: 'Continue', onPress: () => router.push('/onboarding/finish') }}
    >
      <View style={styles.warning}>
        <AlertCircle size={20} color="#B98500" />
        <RNText variant="base" size="sm" style={styles.warningText}>
          The AI is not a therapist and does not replace professional care. It can suggest
          evidence-based tools based on your entries and trends.
        </RNText>
      </View>

      <View style={styles.prompts}>
        {prompts.map((item, index) => {
          const expanded = expandedIndex === index;
          return (
            <TouchableOpacity
              key={item.question}
              activeOpacity={0.8}
              onPress={() => setExpandedIndex(expanded ? null : index)}
              style={styles.prompt}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
            >
              <View style={styles.promptHeader}>
                <RNText variant="medium" size="sm" style={styles.question}>{item.question}</RNText>
                <ChevronDown
                  size={18}
                  color={Colors.primaryText}
                  style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
                />
              </View>
              {expanded && (
                <View style={styles.answer}>
                  <RNText variant="base" size="sm" style={styles.answerText}>{item.answer}</RNText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </OnboardingScreen>
  );
};

const styles = StyleSheet.create({
  warning: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF6DE',
    borderWidth: 1,
    borderColor: '#F0D58A',
    borderRadius: 14,
    padding: 14,
  },
  warningText: { flex: 1, color: Colors.brown, lineHeight: 20 },
  prompts: { gap: 10 },
  prompt: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0DD',
    overflow: 'hidden',
  },
  promptHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  question: { flex: 1, color: Colors.brown },
  answer: { paddingHorizontal: 14, paddingBottom: 14 },
  answerText: { color: Colors.brown, lineHeight: 21 },
});

export default Fifth;
