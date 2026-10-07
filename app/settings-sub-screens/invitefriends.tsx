import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const InviteFriends = () => {
  const { bottom } = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right", "bottom"]}
    >
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.imageContainer}>
          <Svg width="220" height="220" viewBox="0 0 200 200">
            <Circle cx="100" cy="100" r="100" fill="#EFEFDE" />
            <Path
              d="M 12 147
                 L 66 82
                 L 100 125
                 L 134 82
                 L 188 147
                 A 100 100 0 0 1 12 147"
              fill={Colors.green}
            />
            <Circle cx="100" cy="78" r="48" fill={Colors.brown} />
            <Path d="M 52 78 A 48 48 0 0 1 148 78 Z" fill={Colors.green} />
          </Svg>
        </View>

        <RNText variant="title" size="lg" style={styles.description}>
          Bring your friends on board and{'\n'}enjoy the experience together.
        </RNText>

        <View style={styles.actions}>
          <View style={styles.inputContainer}>
            <RNText variant="title" size="md" style={styles.inputText}>
              link
            </RNText>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={() => {}}>
            <RNText variant="title" size="lg" style={styles.shareText}>
              share
            </RNText>
            <ArrowRight size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 44,
  },
  description: {
    textAlign: 'center',
    color: Colors.brown,
    marginBottom: 50,
    lineHeight: 28,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    width: '100%',
    height: 64,
    backgroundColor: Colors.background,
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 32,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  inputText: {
    color: Colors.brown,
  },
  shareButton: {
    width: '100%',
    height: 64,
    backgroundColor: Colors.brown,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  shareText: {
    color: Colors.white,
    marginTop: 2,
  },
});

export default InviteFriends;