import ArrowRight from '@/assets/svgs/arrowright.svg';
import { BackButton } from '@/components/ui/BackButton';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

const Fourth = () => {
  const [range, setRange] = useState<'Weekly' | 'Monthly'>('Weekly');

  const chartData = [
    { value: 6, label: 'Mon' },
    { value: 7, label: 'Tue' },
    { value: 8, label: 'Wed' },
    { value: 6.5, label: 'Thu' },
    { value: 7.5, label: 'Fri' },
    { value: 7.2, label: 'Sat' },
    { value: 7.8, label: 'Sun' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton style={{ marginBottom: 10 }} />
        <View style={styles.header}>
          <RNText variant="medium" size="sm" style={{ color: Colors.green }}>Step 04 · Analytics</RNText>
          <View style={styles.titleContainer}>
            <RNText variant="title" size="4xl" style={styles.titleText}>See your</RNText>
            <RNText variant="title" size="4xl" style={[styles.titleText, { color: Colors.green }]}>Patterns unfold</RNText>
          </View>
          <RNText variant="medium" size="md" style={styles.description}>
            After about a week of check ins, your trends start to show up. You will begin to see what helps and what makes things harder.
          </RNText>
        </View>

        <View style={styles.promptBox}>
          <RNText variant="medium" size="md" style={styles.promptText}>
            Today's optional prompt:{'\n'}
            <RNText variant="base" size="md" style={{ fontStyle: 'italic', opacity: 0.8 }}>
              "What's one thing that felt heavy today and one thing that felt easy?"
            </RNText>
          </RNText>
        </View>

        <View style={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.statCard}>
              <RNText variant="medium" size="sm" style={styles.statLabel}>Avg Mood</RNText>
              <RNText variant="header" size="2xl" style={styles.statValue}>7.2</RNText>
              <RNText variant="medium" size="xs" style={styles.statChange}>+0.8</RNText>
            </View>
          ))}
        </View>

        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View>
              <RNText variant="header" size="md" style={styles.chartTitle}>Mood Trends</RNText>
              <RNText variant="medium" size="xs" style={styles.chartSubtitle}>Your emotional journey over time</RNText>
            </View>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setRange('Weekly')}
                style={[styles.toggleButton, range === 'Weekly' && styles.activeToggle]}
              >
                <RNText variant="medium" size="xs" style={[styles.toggleText, range === 'Weekly' && styles.activeToggleText]}>Weekly</RNText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRange('Monthly')}
                style={[styles.toggleButton, range === 'Monthly' && styles.activeToggle]}
              >
                <RNText variant="medium" size="xs" style={[styles.toggleText, range === 'Monthly' && styles.activeToggleText]}>Monthly</RNText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 80}
              height={150}
              noOfSections={4}
              maxValue={10}
              color={Colors.green}
              thickness={3}
              dataPointsColor={Colors.green}
              hideYAxisText={false}
              yAxisTextStyle={{ color: '#6D6661', fontSize: 10 }}
              xAxisLabelTextStyle={{ color: '#6D6661', fontSize: 10 }}
              hideRules={false}
              rulesColor="#E5E0DD"
              rulesType="solid"
              curved
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/onboarding/fifth')}
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
  promptBox: {
    backgroundColor: '#EBE5E1',
    padding: 16,
    borderRadius: 16,
  },
  promptText: {
    color: '#4B3425',
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    flex: 1,
    minWidth: '45%',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E0DD',
  },
  statLabel: {
    color: Colors.green,
  },
  statValue: {
    color: '#4B3425',
  },
  statChange: {
    color: '#6D6661',
    opacity: 0.8,
  },
  chartSection: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: '#E5E0DD',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    color: '#4B3425',
  },
  chartSubtitle: {
    color: '#6D6661',
    opacity: 0.6,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5E9',
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeToggle: {
    backgroundColor: Colors.green,
  },
  toggleText: {
    color: '#6D6661',
  },
  activeToggleText: {
    color: Colors.white,
  },
  chartWrapper: {
    alignItems: 'center',
    marginLeft: -10,
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

export default Fourth;

