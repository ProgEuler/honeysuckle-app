import Back from '@/assets/svgs/back.svg';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { Cpu, Heart, Info, Target, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GuideScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 20,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.brown,
            borderRadius: 40,
          }}
        >
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl">
          How to Use
        </RNText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, pb: 100 }}>
        <View style={{ gap: 24 }}>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Target color={Colors.green} size={24} />
              <RNText variant="header" size="lg">Your Daily Flow</RNText>
            </View>
            <RNText variant="base" size="md">
              Start each day with a 2-minute "Daily Check-in." Select the mood that fits best, note the time it started, and write a brief journal entry.
            </RNText>
          </View>

          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TrendingUp color={Colors.green} size={24} />
              <RNText variant="header" size="lg">Consistency Matters</RNText>
            </View>
            <RNText variant="base" size="md">
              Tracking your mood daily—even on "boring" days—helps our AI identify subtle patterns in your emotional well-being over time.
            </RNText>
          </View>

          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Info color={Colors.green} size={24} />
              <RNText variant="header" size="lg">Review Your Insights</RNText>
            </View>
            <RNText variant="base" size="md">
              Visit the "Analytics" tab to see your mood trends, anxiety levels, and top emotions. These insights can help you understand your triggers better.
            </RNText>
          </View>

          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Cpu color={Colors.green} size={24} />
              <RNText variant="header" size="lg">Use AI for Support</RNText>
            </View>
            <RNText variant="base" size="md">
              Unsure what to write? Use our "Inspiration Prompts" or chat directly with our AI companion for evidence-based emotional support and guidance.
            </RNText>
          </View>

          <View style={{ gap: 12, mt: 20, p: 20, backgroundColor: '#FEF2F2', borderRadius: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Heart color="#DC2626" size={24} />
              <RNText variant="header" size="lg" style={{ color: '#991B1B' }}>When Mood Dips</RNText>
            </View>
            <RNText variant="base" size="md" style={{ color: '#991B1B' }}>
              If you’re feeling overwhelmed or in crisis, please reach out for professional help immediately.
            </RNText>
            <View style={{ gap: 4 }}>
              <RNText variant="medium" size="sm">National Crisis Lifeline: 988</RNText>
              <RNText variant="medium" size="sm">Emergency Services: 911</RNText>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <RNButton value="Get Started" path={'/(tabs)/home'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuideScreen;
