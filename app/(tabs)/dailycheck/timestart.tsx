import Calender from '@/assets/svgs/calender.svg';
import TimePick from '@/components/timepick';
import { BackButton } from '@/components/ui/BackButton';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TimeStart = () => {
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
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
          }}
        >
         <BackButton />
          <RNText variant="title" size="xl">
            Assessment
          </RNText>
        </View>
        <View
          style={{
            backgroundColor: '#E8DDD9',
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 30,
          }}
        >
          <RNText variant="title" size="sm" style={{ color: '#926247' }}>
            2 OF 3
          </RNText>
        </View>
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
              Since When Have You Been Feeling This Way? (Date only)
            </RNText>
          </View>
          <View>
            <RNText variant="header" size="xl" style={{ marginBottom: 20 }}>
              About when did this start?
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
        <RNButton
          value={'Save Entry'}
          path={'/(tabs)/dailycheck/journalentry'}
        />
      </View>
    </SafeAreaView>
  );
};

export default TimeStart;
