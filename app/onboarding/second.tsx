import ArrowRight from '@/assets/svgs/arrowright.svg';
import Clock from '@/assets/svgs/clock.svg';
import { BackButton } from '@/components/ui/BackButton';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Second = () => {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton style={{ marginBottom: 10 }} />
        <View style={styles.header}>
          <RNText variant="medium" size="sm" style={{ color: Colors.green }}>Step 02 · Quick Journal</RNText>
          <View style={styles.titleContainer}>
            <RNText variant="title" size="4xl" style={styles.titleText}>What's on</RNText>
            <RNText variant="title" size="4xl" style={[styles.titleText, { color: Colors.green }]}>your mind?</RNText>
          </View>
          <RNText variant="medium" size="md" style={styles.description}>
            Write a few lines — or even just one sentence. No format, no pressure. Just what's true right now.
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Start writing here..."
            placeholderTextColor="#A09893"
            multiline
            maxLength={500}
            value={text}
            onChangeText={setText}
          />
          <View style={styles.charCountContainer}>
            <RNText variant="medium" size="xs" style={styles.charCount}>
              {text.length}/500
            </RNText>
          </View>
        </View>

        <View style={styles.tipContainer}>
          <Clock width={18} height={18} fill="#6D6661" />
          <RNText variant="medium" size="sm" style={styles.tipText}>
            30 seconds is enough. Even one sentence counts.
          </RNText>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/onboarding/third')}
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
  inputContainer: {
    backgroundColor: '#E5EAD7',
    borderRadius: 16,
    padding: 16,
    height: 200,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Regular',
    fontSize: 18,
    color: '#4B3425',
    textAlignVertical: 'top',
  },
  charCountContainer: {
    alignItems: 'flex-end',
  },
  charCount: {
    color: '#6D6661',
    opacity: 0.6,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    color: '#6D6661',
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

export default Second;
