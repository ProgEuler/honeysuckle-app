import ArrowRight from '@/assets/svgs/arrowright.svg';
import { BackButton } from '@/components/ui/BackButton';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { AlertCircle, ChevronDown } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Fifth = () => {
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
          <View style={styles.promptItem}>
            <View style={styles.promptHeader}>
               <RNText variant="medium" size="sm" style={styles.promptLabel}>What patterns do you notice this week?</RNText>
               <ChevronDown size={18} color="#6D6661" />
            </View>
            <View style={styles.responseBox}>
              <RNText variant="base" size="sm" style={styles.responseText}>
                Your mood dips mid-week (Wednesday) consistently over the past 3 weeks. Your anxiety spikes correlate with lower sleep scores. Consider protecting Wednesday evenings.
              </RNText>
            </View>
          </View>

          {[
            'What might be triggering my anxiety?',
            'Give me 3 evidence-based tools.',
            'Summarize my last 7 days.'
          ].map((prompt, index) => (
            <View key={index} style={styles.collapsedPrompt}>
              <RNText variant="medium" size="sm" style={styles.promptLabel}>{prompt}</RNText>
              <ChevronDown size={18} color="#6D6661" />
            </View>
          ))}
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
