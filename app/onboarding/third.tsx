import OnboardingScreen, { useCompactLayout } from '@/components/onboarding/OnboardingScreen';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
    description: "Life doesn't follow a schedule. Add an extra check-in whenever you need it.",
  },
];

const Third = () => {
  const [selectedRhythm, setSelectedRhythm] = useState<string | null>(null);
  const compact = useCompactLayout();

  return (
    <OnboardingScreen
      step="Step 03 · Your Routine"
      title={['Pick a rhythm', 'that fits your life']}
      description="Pick what fits your real life. You can change it anytime. What matters most is coming back to it."
      action={{ label: 'Continue', onPress: () => router.push('/onboarding/fourth') }}
    >
      <View style={styles.options}>
        {rhythmOptions.map((option) => {
          const active = selectedRhythm === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedRhythm(option.id)}
              style={[styles.card, { padding: compact ? 16 : 20 }, active && styles.cardActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
            >
              <RNText variant="header" size="lg">{option.title}</RNText>
              <RNText variant="medium" size="sm" style={styles.subtitle}>{option.subtitle}</RNText>
              <RNText variant="base" size={compact ? 'sm' : 'md'} style={styles.description}>
                {option.description}
              </RNText>
            </TouchableOpacity>
          );
        })}
      </View>
    </OnboardingScreen>
  );
};

const styles = StyleSheet.create({
  options: { gap: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0DD',
    gap: 4,
  },
  cardActive: { borderColor: Colors.green, backgroundColor: '#F1F5E9' },
  subtitle: { color: Colors.green, marginBottom: 4 },
  description: { color: Colors.primaryText, lineHeight: 22 },
});

export default Third;
