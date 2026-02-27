import Back from '@/assets/svgs/back.svg';
import Depressed from '@/assets/svgs/depressed.svg';
import Excellent from '@/assets/svgs/excellent.svg';
import Happy from '@/assets/svgs/happy.svg';
import Neutral from '@/assets/svgs/neutral.svg';
import Sad from '@/assets/svgs/sad.svg';
import { BackButton } from '@/components/ui/BackButton';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const moodOptions = [
  {
    label: 'Excellent',
    icon: Excellent,
  },
  {
    label: 'Happy',
    icon: Happy,
  },
  {
    label: 'Neutral',
    icon: Neutral,
  },
  {
    label: 'Sad',
    icon: Sad,
  },
  {
    label: 'Depressed',
    icon: Depressed,
  },
];

const EmotionType = () => {
  // const [moods, setMoods] = useState({
  //   Excellent: false,
  //   Happy: false,
  //   Neutral: false,
  //   Sad: false,
  //   Depressed: false,
  // });
  // const handleMoodSelect = (selectedMood) => {
  //   setMoods({
  //     Excellent: false,
  //     Happy: false,
  //     Neutral: false,
  //     Sad: false,
  //     Depressed: false,
  //     [selectedMood]: true, // only this becomes true
  //   });
  // };

  const [selectedMood, setSelectedMood] = useState(null);
  const handleMoodSelect = (label) => {
    setSelectedMood(label);
  };

  return (
    <>
      <SafeAreaView>
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
              2 OF 4
            </RNText>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={{ paddingBottom: 50 }}>
          <View
            style={{
              width: '90%',
              marginHorizontal: 'auto',
              marginTop: 20,
            }}
          >
            <RNText variant="title" size="3xl" style={{ textAlign: 'center' }}>
              Every day is different, Choose the mood that fits best today
            </RNText>
          </View>
          <View
            style={{
              width: '90%',
              marginHorizontal: 'auto',
              gap: 20,
              marginTop: 50,
              marginBottom: 30,
            }}
          >
            {moodOptions.map((mood, index) => {
              const isActive = selectedMood === mood.label;
              return (
                <TouchableOpacity
                  onPress={() => handleMoodSelect(mood.label)}
                  key={index}
                  style={{
                    flexDirection: 'row',
                    borderColor: Colors.green,
                    backgroundColor: isActive ? '#CFD9B5' : Colors.white,
                    borderWidth: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 25,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <RNText
                    variant="title"
                    size="3xl"
                    style={{ color: '#8F8985' }}
                  >
                    {mood.label}
                  </RNText>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <mood.icon />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
            <View style={{ width: '100%' }}>
              <RNButton
                value={'Continue'}
                path={'/(tabs)/dailycheck/timestart'}
                // tag={'replace'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default EmotionType;
