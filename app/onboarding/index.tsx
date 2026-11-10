import OnboardingScreen, { useCompactLayout } from '@/components/onboarding/OnboardingScreen';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const highlights = [
  { value: '~2 min', label: 'Daily practice' },
  { value: '7 days', label: 'See patterns' },
  { value: 'AI', label: 'Personalised' },
];

const Index = () => {
  const compact = useCompactLayout();

  return (
    <OnboardingScreen
      showBack={false}
      centered
      title={['Your path to', 'Emotional clarity']}
      description="A calm daily habit to track your mood, notice patterns, and feel a little more steady. Just a couple minutes a day."
      action={{ label: 'Show me how it works', onPress: () => router.push('/onboarding/first') }}
      above={
        <View style={styles.brand}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          <RNText variant="title" size="lg" style={{ color: Colors.green }}>Honeysuckle Trail</RNText>
        </View>
      }
    >
      <View style={styles.cards}>
        {highlights.map((item) => (
          <View key={item.label} style={[styles.card, { paddingVertical: compact ? 14 : 20 }]}>
            <RNText variant="header" size={compact ? 'lg' : 'xl'} style={styles.cardValue}>
              {item.value}
            </RNText>
            <RNText variant="medium" size="xs" style={styles.cardLabel}>{item.label}</RNText>
          </View>
        ))}
      </View>
    </OnboardingScreen>
  );
};

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  cards: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: { color: Colors.green, marginBottom: 4 },
  cardLabel: { textAlign: 'center', color: Colors.primaryText },
});

export default Index;
