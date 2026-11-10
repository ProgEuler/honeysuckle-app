import Clock from '@/assets/svgs/clock.svg';
import OnboardingScreen, { useCompactLayout } from '@/components/onboarding/OnboardingScreen';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const Second = () => {
  const [text, setText] = useState('');
  const compact = useCompactLayout();

  return (
    <OnboardingScreen
      step="Step 02 · Quick Journal"
      title={["What's on", 'your mind?']}
      description="Write what is true right now. One sentence is enough. Keep it simple."
      action={{ label: 'Continue', onPress: () => router.push('/onboarding/third') }}
    >
      <View style={styles.prompt}>
        <RNText variant="medium" size="sm" style={{ color: Colors.brown }}>Today's optional prompt</RNText>
        <RNText variant="base" size="md" style={styles.promptText}>
          "What's one thing that felt heavy today and one thing that felt easy?"
        </RNText>
      </View>

      <View style={[styles.inputBox, { minHeight: compact ? 140 : 180 }]}>
        <TextInput
          style={styles.input}
          placeholder="Start writing here..."
          placeholderTextColor="#A09893"
          multiline
          maxLength={500}
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
        />
        <RNText variant="medium" size="xs" style={styles.count}>{text.length}/500</RNText>
      </View>

      <View style={styles.tip}>
        <Clock width={18} height={18} fill={Colors.primaryText} />
        <RNText variant="medium" size="sm" style={{ color: Colors.primaryText, flex: 1 }}>
          30 seconds is enough. Even one sentence counts.
        </RNText>
      </View>
    </OnboardingScreen>
  );
};

const styles = StyleSheet.create({
  prompt: { backgroundColor: '#EBE5E1', padding: 16, borderRadius: 16, gap: 4 },
  promptText: { fontStyle: 'italic', color: Colors.brown, opacity: 0.85, lineHeight: 22 },
  inputBox: { backgroundColor: '#E5EAD7', borderRadius: 16, padding: 16 },
  input: { flex: 1, fontSize: 16, fontFamily: 'Regular', color: Colors.brown },
  count: { alignSelf: 'flex-end', color: Colors.primaryText },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export default Second;
