import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { Cpu, Heart, Info, Target, TrendingUp, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const sections: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Target,
    title: 'Your daily flow',
    body: 'Rate your mood and anxiety in a few seconds. Add sleep, what is affecting you and a short journal entry when you have a minute more.',
  },
  {
    Icon: TrendingUp,
    title: 'Consistency matters',
    body: 'Checking in even on "boring" days helps you and the AI spot subtle patterns in how you feel over time.',
  },
  {
    Icon: Info,
    title: 'Review your insights',
    body: 'The Analytics tab shows your mood and anxiety trends, sleep, and what has been affecting you most.',
  },
  {
    Icon: Cpu,
    title: 'Use AI for support',
    body: 'Unsure what to write? Use the writing prompts, or talk things through with the AI companion.',
  },
];

const GuideScreen = () => (
  <OnboardingScreen
    title={['How to use', 'Honeysuckle Trail']}
    action={{ label: 'Get started', onPress: () => router.replace('/(tabs)/home') }}
  >
    {sections.map(({ Icon, title, body }) => (
      <View key={title} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon color={Colors.green} size={22} />
          <RNText variant="header" size="lg">{title}</RNText>
        </View>
        <RNText variant="base" size="md" style={styles.body}>{body}</RNText>
      </View>
    ))}

    <View style={styles.crisis}>
      <View style={styles.sectionHeader}>
        <Heart color="#DC2626" size={22} />
        <RNText variant="header" size="lg" style={{ color: '#991B1B' }}>When mood dips</RNText>
      </View>
      <RNText variant="base" size="md" style={{ color: '#991B1B', lineHeight: 22 }}>
        If you're feeling overwhelmed or in crisis, please reach out for professional help right away.
      </RNText>
      <RNText variant="medium" size="sm">988 Suicide & Crisis Lifeline: call or text 988</RNText>
      <RNText variant="medium" size="sm">Emergency services: 911</RNText>
    </View>
  </OnboardingScreen>
);

const styles = StyleSheet.create({
  section: { gap: 6 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  body: { color: Colors.primaryText, lineHeight: 22 },
  crisis: { gap: 8, padding: 18, backgroundColor: '#FEF2F2', borderRadius: 20 },
});

export default GuideScreen;
