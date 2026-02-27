import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotOtp = () => {
  const [verify, setVerify] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          backgroundColor: Colors.green,
          width: 960,
          height: 960,
          position: 'absolute',
          top: -750,
          left: '50%',
          marginLeft: -480,
          borderRadius: 1234,
        }}
      />
      <SafeAreaView style={{ flex: 1, marginTop: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ height: 60, width: 60 }}
          />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            contentContainerStyle={{ marginTop: 120 }}
          >
            <View
              style={{
                width: '90%',
                marginHorizontal: 'auto',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 40,
              }}
            >
              <View style={{ gap: 20, width: '90%', marginHorizontal: 'auto' }}>
                <RNText
                  variant="title"
                  size="3xl"
                  style={{ textAlign: 'center' }}
                >
                  Enter 4 digit OTP Code
                </RNText>
                <RNText
                  variant="base"
                  size="lg"
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                    width: '90%',
                    marginHorizontal: 'auto',
                  }}
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
              <View style={{ width: '100%' }}>
                <RNButton value={'Continue'} path={'/auth/newpassword'} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 50,
                }}
              >
                <RNText variant="medium" size="lg">
                  {' '}
                  Didn't receive the code?{' '}
                </RNText>
                <TouchableOpacity
                  // onPress={() => router.replace('/auth')}
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <RNText
                    variant="medium"
                    size="lg"
                    style={{
                      color: Colors.orange,
                      textDecorationLine: 'underline',
                    }}
                  >
                    Resend.
                  </RNText>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
};

export default ForgotOtp;

const styles = StyleSheet.create({
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
