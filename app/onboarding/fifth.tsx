import ArrowRight from '@/assets/svgs/arrowright.svg';
import { BackButton } from '@/components/ui/BackButton';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { AlertCircle, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Fifth = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const prompts = [
    {
      question: 'What patterns do you notice this week?',
      answer: 'Your mood dips mid-week (Wednesday) consistently over the past 3 weeks. Your anxiety spikes correlate with lower sleep scores. Consider protecting Wednesday evenings.'
    },
    {
      question: 'What might be triggering my anxiety?',
      answer: 'Based on your entries, work-related stress and lack of sleep usually precede your anxiety spikes. Try to prioritize rest and mindful breaks.'
    },
    {
      question: 'Give me 3 evidence-based tools.',
      answer: '1. 4-7-8 Breathing Technique\n2. Progressive Muscle Relaxation\n3. Cognitive Restructuring Exercises'
    },
    {
      question: 'Summarize my last 7 days.',
      answer: 'You started the week feeling overwhelmed but gradually improved. You engaged in 3 positive activities and logged 4 journal entries over the weekend.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton style={{ marginBottom: 10 }} />
        <View style={styles.header}>
          <RNText variant="medium" size="sm" style={{ color: Colors.green }}>Step 05 · AI Support</RNText>
          <View style={styles.titleContainer}>
            <RNText variant="title" size="4xl" style={styles.titleText}>Your AI</RNText>
            <RNText variant="title" size="4xl" style={[styles.titleText, { color: Colors.green }]}>support companion</RNText>
          </View>
        </View>

        <View style={styles.warningBox}>
          <AlertCircle size={20} color="#E0A500" />
          <RNText variant="base" size="sm" style={styles.warningText}>
            The AI is not a therapist and does not replace professional care. It can suggest evidence-based tools based on your entries and trends.
          </RNText>
        </View>

        <RNText variant="medium" size="md" style={styles.description}>
          The AI reviews your mood data and journal entries together — and offers thoughtful, personalised suggestions. Tap a prompt to see how it responds.
        </RNText>

        <View style={styles.promptsContainer}>
          {prompts.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => toggleAccordion(index)}
                style={isExpanded ? styles.promptItem : styles.collapsedPrompt}
              >
                <View style={styles.promptHeader}>
                  <RNText variant="medium" size="sm" style={styles.promptLabel}>{item.question}</RNText>
                  <ChevronDown
                    size={18}
                    color="#6D6661"
                    style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                  />
                </View>

                {isExpanded && (
                  <View style={styles.responseBox}>
                    <RNText variant="base" size="sm" style={styles.responseText}>
                      {item.answer}
                    </RNText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/onboarding/finish')}
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
    gap: 24,
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
  warningBox: {
    backgroundColor: '#FFEBC2',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0A500',
  },
  warningText: {
    flex: 1,
    color: '#4B3425',
    lineHeight: 20,
  },
  description: {
    color: '#6D6661',
    lineHeight: 24,
  },
  promptsContainer: {
    gap: 12,
  },
  promptItem: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0DD',
    overflow: 'hidden',
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  responseBox: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#F7F4F2',
  },
  responseText: {
    color: '#4B3425',
    lineHeight: 22,
  },
  collapsedPrompt: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0DD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptLabel: {
    color: '#4B3425',
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

export default Fifth;
