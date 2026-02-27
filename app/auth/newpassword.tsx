import Lock from '@/assets/svgs/lock.svg';
import InputForm from '@/components/inputform';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewPassword = () => {
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
            gap: 20,
          }}
        >
          <View style={{ gap: 10 }}>
            <RNText variant="title" size="3xl" style={{ textAlign: 'center' }}>
              Create New Password
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
              Your new password must be unique from those previously used.
            </RNText>
          </View>
          <View style={{ gap: 10 }}>
            <View style={{ gap: 20 }}>
              <InputForm
                title={'password'}
                label={'Password'}
                placeHolder={'Enter your password'}
                control={dummyForm.control}
                errors={{}}
                Icon={Lock}
              />
              <InputForm
                title={'confirmPassword'}
                label={'Confirm Password'}
                placeHolder={'Confirm Password'}
                control={dummyForm.control}
                errors={{}}
                Icon={Lock}
              />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <RNButton path={'/auth'} value={'Save'} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default NewPassword;
