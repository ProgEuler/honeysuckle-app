import ArrowRight from '@/assets/svgs/arrowright.svg';
import { BackButton } from '@/components/ui/BackButton';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const rhythmOptions = [
  {
    id: 'morning',
    title: 'Morning',
    subtitle: 'Set mood & intentions',
    description: 'Start your day with clarity. Takes 2 minutes before the chaos begins.',
  },
  {
    id: 'evening',
    title: 'Evening',
    subtitle: 'Reflect on the day',
    description: 'Wind down with awareness. Process what happened and how it made you feel.',
  },
  {
    id: 'anytime',
    title: 'Anytime',
    subtitle: 'When something big happens',
    description: 'Life doesn\'t follow a schedule. Add an extra checking whenever you need it.',
  },
];

const Third = () => {
  const [selectedRhythm, setSelectedRhythm] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton style={{ marginBottom: 10 }} />
        <View style={styles.header}>
          <RNText variant="medium" size="sm" style={{ color: Colors.green }}>Step 03 · Your Routine</RNText>
          <View style={styles.titleContainer}>
            <RNText variant="title" size="4xl" style={styles.titleText}>Pick a rhythm</RNText>
            <RNText variant="title" size="4xl" style={[styles.titleText, { color: Colors.green }]}>that fits your life</RNText>
          </View>
          <RNText variant="medium" size="md" style={styles.description}>
            Pick what fits your real life. You can change it anytime. What matters most is coming back to it.
          </RNText>
        </View>

        <View style={styles.optionsContainer}>
          {rhythmOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedRhythm(option.id)}
              style={[
                styles.optionCard,
                selectedRhythm === option.id && styles.selectedOptionCard,
              ]}
            >
              <View style={styles.optionHeader}>
                 <RNText variant="header" size="lg" style={styles.optionTitle}>{option.title}</RNText>
              </View>
              <RNText variant="medium" size="sm" style={styles.optionSubtitle}>{option.subtitle}</RNText>
              <RNText variant="base" size="md" style={styles.optionDescription}>{option.description}</RNText>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/onboarding/fourth')}
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
  description: {
    color: '#6D6661',
    lineHeight: 24,
    marginTop: 8,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0DD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOptionCard: {
    borderColor: Colors.green,
    backgroundColor: '#F1F5E9',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    color: '#4B3425',
  },
  optionSubtitle: {
    color: Colors.green,
    marginBottom: 8,
  },
  optionDescription: {
    color: '#6D6661',
    lineHeight: 22,
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

export default Third;

