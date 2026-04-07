import Back from '@/assets/svgs/back.svg';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';

const Otp = () => {
  const [verify, setVerify] = useState(false);
  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl">
          OTP Setup
        </RNText>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.headerContent}>
          <RNText variant="title" size="2xl" style={styles.titleText}>
            Enter 4 digit OTP Code
          </RNText>
          <RNText
            variant="medium"
            size="md"
            style={styles.subtitleText}
          >
            We’ve sent a 4-digit verification code to your Email. Enter the code
            below to proceed.
          </RNText>
        </View>
        <View>
          <OtpInput
            numberOfDigits={4}
            autoFocus={false}
            focusStickBlinkingDuration={500}
            type="numeric"
            onTextChange={(text) => console.log(text)}
            onFilled={(text) => {
              console.log(`OTP is ${text}`);
              setVerify(true);
            }}
            theme={{
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              focusStickStyle: styles.focusStick,
              containerStyle: styles.container,
              filledPinCodeContainerStyle: styles.filledPinCodeContainer,
              focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            }}
          />
        </View>
        <View style={styles.fullWidth}>
          <RNButton value={'Continue'} path={'/onboarding'} />
        </View>
        <View style={styles.footerRow}>
          <RNText variant="subtitle" size="sm">
            Din't receive the code?
          </RNText>
          <RNText
            variant="subtitle"
            size="sm"
            style={styles.linkText}
          >
            Resend.
          </RNText>
        </View>
      </View>
    </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.brown,
    alignItems: 'flex-start',
    borderRadius: 40,
  },
  mainContent: {
    width: '90%',
    marginHorizontal: 'auto',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
    marginTop: -100,
  },
  headerContent: {
    width: '95%',
    marginHorizontal: 'auto',
    gap: 20,
  },
  titleText: {
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
    lineHeight: 30,
  },
  fullWidth: {
    width: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 20,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: Colors.orange,
  },
  container: {
    padding: 10,
  },
  pinCodeContainer: {
    borderColor: Colors.green,
    width: 75,
    height: 105,
    backgroundColor: Colors.white,
    borderRadius: 50,
  },
  pinCodeText: {
    color: Colors.white,
    fontFamily: 'ExtraBold',
    fontSize: 50,
  },
  focusStick: {
    backgroundColor: Colors.green,
  },
  filledPinCodeContainer: {
    borderColor: Colors.green,
    backgroundColor: Colors.green,
  },
  activePinCodeContainer: {
    borderColor: Colors.green,
  },
});
