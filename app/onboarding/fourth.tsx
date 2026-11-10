import OnboardingScreen, { useCompactLayout } from '@/components/onboarding/OnboardingScreen';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

// Sample data: this screen previews what Analytics shows after a week.
const sampleStats = [
  { label: 'Average mood', value: '7.2', unit: '/10' },
  { label: 'Average anxiety', value: '3.4', unit: '/10' },
  { label: 'Average sleep', value: '7.1', unit: 'hours' },
  { label: 'Check-ins', value: '9', unit: 'this week' },
];

const sampleWeek = [
  { value: 6, label: 'Mon' },
  { value: 7, label: 'Tue' },
  { value: 5.5, label: 'Wed' },
  { value: 6.5, label: 'Thu' },
  { value: 7.5, label: 'Fri' },
  { value: 7.2, label: 'Sat' },
  { value: 7.8, label: 'Sun' },
];

const Fourth = () => {
  const compact = useCompactLayout();
  const [chartWidth, setChartWidth] = useState(0);
  const plotWidth = Math.max(0, chartWidth - 40);

  return (
    <OnboardingScreen
      step="Step 04 · Analytics"
      title={['See your', 'patterns unfold']}
      description="After about a week of check-ins, your trends start to show up. You'll begin to see what helps and what makes things harder."
      action={{ label: 'Continue', onPress: () => router.push('/onboarding/fifth') }}
    >
      <View style={styles.grid}>
        {sampleStats.map((stat) => (
          <View key={stat.label} style={[styles.stat, { padding: compact ? 12 : 16 }]}>
            <RNText variant="medium" size="xs" style={{ color: Colors.green }}>{stat.label}</RNText>
            <RNText variant="header" size={compact ? 'xl' : '2xl'}>
              {stat.value}
              <RNText variant="medium" size="xs" style={styles.muted}> {stat.unit}</RNText>
            </RNText>
          </View>
        ))}
      </View>

      <View style={styles.chartCard} onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
        <View>
          <RNText variant="header" size="md">Mood this week</RNText>
          <RNText variant="medium" size="xs" style={styles.muted}>Example of what you'll see</RNText>
        </View>
        {plotWidth > 0 && (
          <LineChart
            data={sampleWeek}
            width={plotWidth}
            height={compact ? 120 : 150}
            spacing={plotWidth / (sampleWeek.length - 1)}
            initialSpacing={6}
            endSpacing={6}
            noOfSections={2}
            maxValue={10}
            color={Colors.green}
            thickness={3}
            dataPointsColor={Colors.green}
            yAxisColor="transparent"
            xAxisColor="#E5E0DD"
            yAxisTextStyle={styles.axis}
            xAxisLabelTextStyle={styles.axis}
            yAxisLabelWidth={22}
            rulesColor="#F0EBE7"
            rulesType="solid"
            curved
            disableScroll
          />
        )}
      </View>
    </OnboardingScreen>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    gap: 4,
  },
  muted: { color: Colors.primaryText },
  chartCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 14, overflow: 'hidden' },
  axis: { color: Colors.primaryText, fontSize: 10 },
});

export default Fourth;
