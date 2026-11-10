import OnboardingScreen, { useCompactLayout } from '@/components/onboarding/OnboardingScreen';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { Brain, CheckCircle2, Clock, Leaf, LineChart, PenLine, Sun } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const checklistItems = [
  { title: 'Daily Check-In', description: 'Rate your mood & answer a few quick questions.', Icon: Clock },
  { title: 'Quick Journal', description: 'Write a few lines — 30 seconds is enough.', Icon: PenLine },
  { title: 'Your Routine', description: 'Morning, evening, or anytime — you choose.', Icon: Sun },
  { title: 'Review Insights', description: 'Spot patterns in mood, anxiety & sleep.', Icon: LineChart },
  { title: 'AI Support', description: 'Talk things through and get ideas to try.', Icon: Brain },
];

const Finish = () => {
  const compact = useCompactLayout();

  return (
    <OnboardingScreen
      showBack={false}
      step="All set"
      title={["You're ready to", 'start your trail']}
      action={{ label: "Start today's check-in", onPress: () => router.replace('/(tabs)/dailycheck') }}
    >
      <View style={[styles.checklist, { gap: compact ? 12 : 16 }]}>
        {checklistItems.map(({ title, description, Icon }) => (
          <View key={title} style={styles.item}>
            <View style={styles.icon}>
              <Icon size={20} color={Colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <RNText variant="header" size="md">{title}</RNText>
              <RNText variant="medium" size="xs" style={styles.muted}>{description}</RNText>
            </View>
            <CheckCircle2 size={22} color={Colors.green} fill="#F1F5E9" />
          </View>
        ))}
      </View>

      <View style={[styles.card, { padding: compact ? 16 : 20 }]}>
        <View style={styles.cardHeader}>
          <Leaf size={22} color={Colors.green} />
          <RNText variant="title" size={compact ? 'lg' : 'xl'} style={{ flex: 1 }}>
            Consistency is everything.
          </RNText>
        </View>
        <RNText variant="medium" size="sm" style={[styles.muted, { lineHeight: 21 }]}>
          The more consistently you check in, the more accurate and helpful your trends become.
        </RNText>
      </View>
    </OnboardingScreen>
  );
};

const styles = StyleSheet.create({
  checklist: {},
  item: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: { color: Colors.primaryText },
  card: { backgroundColor: Colors.white, borderRadius: 20, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});

export default Finish;
