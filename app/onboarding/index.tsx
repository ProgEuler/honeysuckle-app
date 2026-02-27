import ArrowRight from '@/assets/svgs/arrowright.svg';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          <RNText variant="title" size="lg" style={{ color: Colors.green }}>Honeysuckle Trail</RNText>
        </View>

        <View style={styles.titleContainer}>
          <RNText variant="title" size="4xl" style={styles.titleText}>Your path to</RNText>
          <RNText variant="title" size="4xl" style={[styles.titleText, { color: Colors.green }]}>Emotional clarity</RNText>
        </View>

        <RNText variant="medium" size="lg" style={styles.description}>
          A gentle daily practice that helps you understand your patterns, track your mood, and feel more grounded — in just minutes a day.
        </RNText>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <RNText variant="header" size="xl" style={styles.cardMainText}>~2 min</RNText>
            <RNText variant="medium" size="sm" style={styles.cardSubText}>Daily practice</RNText>
          </View>
          <View style={styles.card}>
            <RNText variant="header" size="xl" style={styles.cardMainText}>7 days</RNText>
            <RNText variant="medium" size="sm" style={styles.cardSubText}>See patterns</RNText>
          </View>
          <View style={styles.card}>
            <RNText variant="header" size="xl" style={styles.cardMainText}>AI</RNText>
            <RNText variant="medium" size="sm" style={styles.cardSubText}>Personalised</RNText>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/onboarding/first')}
          style={styles.button}
        >
          <RNText variant="header" size="lg" style={styles.buttonText}>
            Show me how it works
          </RNText>
          <ArrowRight fill={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  titleContainer: {
    gap: 4,
  },
  titleText: {
    lineHeight: 44,
  },
  description: {
    color: '#6D6661',
    lineHeight: 28,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    aspectRatio: 1,
  },
  cardMainText: {
    color: Colors.green,
    marginBottom: 4,
  },
  cardSubText: {
    textAlign: 'center',
    color: '#6D6661',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.brown,
    paddingVertical: 18,
    borderRadius: 100,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
  },
});

export default Index;

