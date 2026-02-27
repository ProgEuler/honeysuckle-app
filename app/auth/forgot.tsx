import Email from '@/assets/svgs/email.svg';
import InputForm from '@/components/inputform';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Forgot = () => {
  const dummyForm = useForm();
  const [isChecked, setChecked] = useState(false);
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
      <SafeAreaView style={{ flex: 1, gap: 120, marginTop: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ height: 60, width: 60 }}
          />
        </View>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            alignSelf: 'center',
            gap: 40,
          }}
        >
          <View style={{ gap: 20 }}>
            <RNText variant="title" size="3xl" style={{ textAlign: 'center' }}>
              Forgot Password
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
              Don't worry! Please enter the email address linked with your
              account.
            </RNText>
          </View>
          <View style={{ gap: 10 }}>
            <View style={{ gap: 20 }}>
              <InputForm
                title={'email'}
                label={'Enter Your Email Address'}
                placeHolder={'abc@email.com'}
                control={dummyForm.control}
                errors={{}}
                Icon={Email}
              />
            </View>
          </View>
          <View>
            <RNButton path={'/auth/forgototp'} value={'Send'} />
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
              Remember Password?{' '}
            </RNText>
            <TouchableOpacity
              onPress={() => router.replace('/auth')}
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
                Sign In.
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Forgot;
