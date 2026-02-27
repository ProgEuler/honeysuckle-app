import Back from '@/assets/svgs/back.svg';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';

const Otp = () => {
  const [verify, setVerify] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 20,
          marginLeft: 20,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.brown,
            alignItems: 'flex-start',
            borderRadius: 40,
          }}
        >
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl">
          OTP Setup
        </RNText>
      </View>

      <View
        style={{
          width: '90%',
          marginHorizontal: 'auto',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 50,
          marginTop: -100,
        }}
      >
        <View style={{ width: '95%', marginHorizontal: 'auto', gap: 20 }}>
          <RNText variant="title" size="2xl" style={{ textAlign: 'center' }}>
            Enter 4 digit OTP Code
          </RNText>
          <RNText
            variant="medium"
            size="md"
            style={{ textAlign: 'center', lineHeight: 30 }}
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
        <View style={{ width: '100%' }}>
          <RNButton value={'Continue'} path={'/onboarding'} />
        </View>
        <View style={{ flexDirection: 'row', gap: 5, marginTop: 20 }}>
          <RNText variant="subtitle" size="sm">
            Din't receive the code?
          </RNText>
          <RNText
            variant="subtitle"
            size="sm"
            style={{ textDecorationLine: 'underline', color: Colors.orange }}
          >
            Resend.
          </RNText>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Otp;

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
