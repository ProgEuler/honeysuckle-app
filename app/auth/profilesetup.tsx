import Back from '@/assets/svgs/back.svg';
import Calender from '@/assets/svgs/calender.svg';
import Edit from '@/assets/svgs/edit.svg';
import Gender from '@/assets/svgs/gender.svg';
import Location from '@/assets/svgs/location.svg';
import Person from '@/assets/svgs/person.svg';
import DatePicker, { DatePickerRef } from '@/components/datepicker';
import InputForm from '@/components/inputform';
import { RNText } from '@/components/ui/input';
import { RNSwitch } from '@/components/ui/switch';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useUserStore } from '@/store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileSetUp = () => {
  const { hasSoughtProfessionalHelp, setHasSoughtProfessionalHelp } = useUserStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      fullName: '',
      gender: '',
      location: '',
      dateOfBirth: null,
    }
  });
  const DatePickRef = useRef<DatePickerRef>(null);

  const onSubmit = (data: any) => {
    // If we wanted to save all fields to zustand on submit
    // But currently we're just handling the professional help toggle
    router.replace('/auth/picktime');
  };

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
          Profile Setup
        </RNText>
      </View>

      <ScrollView>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 30,
            marginTop: 20,
          }}
        >
          <View>
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.green,
                borderRadius: 150,
                overflow: 'hidden',
              }}
            >
              <Image
                source={require('@/assets/images/person.jpg')}
                style={{ height: 120, width: 120, overflow: 'hidden' }}
              />
            </View>
            <TouchableOpacity
              style={{ position: 'absolute', right: 0, bottom: 0 }}
            >
              <Edit />
            </TouchableOpacity>
          </View>
          <View style={{ width: '100%', gap: 10 }}>
            <InputForm
              title={'fullName'}
              label={'Full Name'}
              placeHolder={'Jhon Doe'}
              control={control}
              errors={{}}
              Icon={Person}
            />
            <View style={{ marginBottom: 10 }}>
              <RNText
                variant="header"
                size="sm"
                style={{ fontSize: 20, marginBottom: 12 }}
              >
                Date of Birth
              </RNText>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, value } }) => (
                  <>
                    <DatePicker ref={DatePickRef} onChange={onChange} />
                    <TouchableOpacity
                      onPress={() => {
                        DatePickRef.current?.showDatePicker();
                      }}
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
                        value={value ? (value as Date).toDateString() : ''}
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
                    </TouchableOpacity>
                  </>
                )}
              />
            </View>
            <InputForm
              title={'gender'}
              label={'Gender'}
              placeHolder={'Enter your gender'}
              control={control}
              errors={{}}
              Icon={Gender}
            />

            <InputForm
              title={'location'}
              label={'Location'}
              placeHolder={'Enter the location'}
              control={control}
              errors={{}}
              Icon={Location}
            />

            <View style={{ marginTop: 20, gap: 15 }}>
              <RNText variant="header" size="md">Additional Information</RNText>

              <RNSwitch
                value={hasSoughtProfessionalHelp ?? false}
                label={'Sought professional help before?'}
                onToggle={setHasSoughtProfessionalHelp}
              />

              <RNSwitch
                value={false}
                label={'Chatbot Notification'}
                onToggle={() => console.log('hello')}
              />
            </View>
          </View>
          <View style={{ width: '100%', marginBottom: 40 }}>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{
                backgroundColor: Colors.brown,
                paddingVertical: 18,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RNText variant="header" size="lg" style={{ color: Colors.white }}>
                Continue
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSetUp;
