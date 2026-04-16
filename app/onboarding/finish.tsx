import ArrowRight from '@/assets/svgs/arrowright.svg';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { Brain, CheckCircle2, Clock, Leaf, LineChart, PenLine, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const checklistItems = [
  {
    title: 'Daily Check-In',
    description: 'Choose your mood & answer a few quick questions.',
    Icon: Clock,
  },
  {
    title: 'Quick Journal',
    description: 'Write a few lines — 30 seconds is enough.',
    Icon: PenLine,
  },
  {
    title: 'Your Routine',
    description: 'Morning, evening, or anytime — you choose.',
    Icon: Sun,
  },
  {
    title: 'Review Insights',
    description: 'Spot patterns in mood, anxiety & emotions.',
    Icon: LineChart,
  },
  {
    title: 'AI Support',
    description: 'Morning, evening, or anytime — you choose.',
    Icon: Brain,
  },
];

const Finish = () => {
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <RNText variant="medium" size="sm" style={{ color: Colors.green }}>All set</RNText>
          <View style={styles.titleContainer}>
            <RNText variant="title" size="4xl" style={styles.titleText}>You're ready to</RNText>
            <RNText variant="title" size="4xl" style={[styles.titleText, { color: Colors.green }]}>start your trail</RNText>
          </View>
        </View>

        <View style={styles.checklist}>
          {checklistItems.map((item, index) => (
            <View key={index} style={styles.checklistItem}>
              <View style={styles.iconContainer}>
                 <item.Icon size={20} color={Colors.green} />
              </View>
              <View style={styles.itemContent}>
                <RNText variant="header" size="md" style={styles.itemTitle}>{item.title}</RNText>
                <RNText variant="medium" size="xs" style={styles.itemDescription}>{item.description}</RNText>
              </View>
              <CheckCircle2 size={24} color={Colors.green} fill="#F1F5E9" />
            </View>
          ))}
        </View>

        <View style={styles.consistencyCard}>
          <View style={styles.consistencyHeader}>
             <Leaf size={24} color={Colors.green} />
             <RNText variant="title" size="xl" style={styles.consistencyTitle}>Consistency is everything.</RNText>
          </View>
          <RNText variant="medium" size="sm" style={styles.consistencyDescription}>
            The more consistently you check in, the more accurate and helpful your trends become.
          </RNText>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/home')}
            style={styles.primaryButton}
          >
            <RNText variant="header" size="lg" style={styles.primaryButtonText}>Start today's check-in</RNText>
            <ArrowRight fill={Colors.white} />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.secondaryButton}
          >
            <RNText variant="header" size="lg" style={styles.secondaryButtonText}>Ask AI about my trends</RNText>
            <ArrowRight fill={Colors.brown} />
          </TouchableOpacity> */}
        </View>

        {/* <View style={styles.disclaimerContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={agreed}
              onValueChange={setAgreed}
              color={agreed ? Colors.green : undefined}
              style={styles.checkbox}
            />
            <RNText variant="medium" size="xs" style={styles.disclaimerText}>
              I understand the AI is a support tool, not a therapist or replacement for professional care.
            </RNText>
          </View>

          <RNText variant="base" size="xs" style={styles.safetyNotice}>
            If you feel unsafe or are in crisis, contact emergency services or a crisis hotline. You are not alone. 🌿
          </RNText>
        </View> */}
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
  checklist: {
    gap: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: '#4B3425',
  },
  itemDescription: {
    color: '#6D6661',
    opacity: 0.8,
  },
  consistencyCard: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E0DD',
    gap: 12,
  },
  consistencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  consistencyTitle: {
    color: '#4B3425',
  },
  consistencyDescription: {
    color: '#6D6661',
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.brown,
    paddingVertical: 18,
    borderRadius: 100,
  },
  primaryButtonText: {
    color: Colors.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    paddingVertical: 18,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E5E0DD',
  },
  secondaryButtonText: {
    color: Colors.brown,
  },
  disclaimerContainer: {
    gap: 16,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  checkbox: {
    marginTop: 2,
    borderRadius: 4,
  },
  disclaimerText: {
    flex: 1,
    color: '#6D6661',
    lineHeight: 18,
  },
  safetyNotice: {
    color: '#6D6661',
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default Finish;
