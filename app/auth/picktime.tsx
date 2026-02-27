import Back from '@/assets/svgs/back.svg';
import Calender from '@/assets/svgs/calender.svg';
import TimePick from '@/components/timepick';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PickTime = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

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
          Notification Setup
        </RNText>
      </View>
      <View
        style={{
          width: '90%',
          marginHorizontal: 'auto',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View style={{ gap: 100, marginBottom: 150 }}>
          <View style={{ width: '90%', marginHorizontal: 'auto' }}>
            <RNText variant="header" size="3xl" style={{ textAlign: 'center' }}>
              When would you like us to remind you to check in each day?
            </RNText>
          </View>
          <View>
            <RNText variant="header" size="xl" style={{ marginBottom: 20 }}>
              Pick a time
            </RNText>
            <View>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, value } }) => (
                  <View style={{ gap: 50 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        backgroundColor: Colors.white,
                        borderRadius: 30,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        alignItems: 'center',
                        borderColor: Colors.green,
                      }}
                    >
                      <Calender />
                      <TextInput
                        placeholder="Select Date"
                        value={value ? value : ''}
                        editable={false}
                        pointerEvents="none"
                        placeholderTextColor="#999"
                        style={{
                          flex: 1,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          borderRadius: 10,
                          fontSize: 18,
                          fontFamily: 'PoppinsRegular',
                          backgroundColor: Colors.white,
                          color: Colors.brown,
                        }}
                      />
                    </View>
                    <TimePick onChange={onChange} />
                  </View>
                )}
              />
            </View>
          </View>
        </View>
        <RNButton value={'Continue'} path={'/(tabs)/home'} />
      </View>
    </SafeAreaView>
  );
};

export default PickTime;
