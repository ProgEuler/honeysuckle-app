import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotOtp = () => {
  const [verify, setVerify] = useState(false);
  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <View style={styles.backgroundCircle} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.mainContent}>
              <View style={styles.headerContent}>
                <RNText
                  variant="title"
                  size="3xl"
                  style={styles.titleText}
                >
                  Enter 4 digit OTP Code
                </RNText>
                <RNText
                  variant="base"
                  size="lg"
                  style={styles.subtitleText}
                >
                  We’ve sent a 4-digit verification code to your Email. Enter
                  the code below to proceed.
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
                <RNButton value={'Continue'} path={'/auth/newpassword'} />
              </View>
              <View style={styles.footerRow}>
                <RNText variant="medium" size="lg">
                  {' '}
                  Didn't receive the code?{' '}
                </RNText>
                <TouchableOpacity
                  // onPress={() => router.replace('/auth')}
                  style={styles.centerAlign}
                >
                  <RNText
                    variant="medium"
                    size="lg"
                    style={styles.linkText}
                  >
                    Resend.
                  </RNText>
                </TouchableOpacity>
              </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default ForgotOtp;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  backgroundCircle: {
    backgroundColor: Colors.green,
    width: 960,
    height: 960,
    position: 'absolute',
    top: -750,
    left: '50%',
    marginLeft: -480,
    borderRadius: 1234,
  },
  safeArea: {
    flex: 1,
    marginTop: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    height: 60,
    width: 60,
  },
  mainContent: {
    width: '90%',
    marginHorizontal: 'auto',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginTop: 120,
  },
  headerContent: {
    gap: 20,
    width: '90%',
    marginHorizontal: 'auto',
  },
  titleText: {
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
    marginBottom: 20,
    width: '90%',
    marginHorizontal: 'auto',
  },
  fullWidth: {
    width: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: Colors.orange,
    textDecorationLine: 'underline',
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
