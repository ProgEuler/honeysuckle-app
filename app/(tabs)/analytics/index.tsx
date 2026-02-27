import Notification from '@/assets/svgs/notification.svg';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { Calendar, Flame, Heart, Smile, TrendingUp } from 'lucide-react-native';
// import { Calendar, Flame } from 'lucide-react-native';
import Depressed from '@/assets/svgs/depressed.svg';
import Excellent from '@/assets/svgs/excellent.svg';
import Happy from '@/assets/svgs/happy.svg';
import Neutral from '@/assets/svgs/neutral.svg';
import Sad from '@/assets/svgs/sad.svg';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  const [selectedSlice, setSelectedSlice] = useState(null);
  const pieData = [
    {
      value: 30,
      color: '#9BB068', // Excellent (Blue)
      gradientCenterColor: '#9BB068',
      text: 'Excellent',
      emoji: Excellent,
      bgColor: '#C9D2AD',
    },
    {
      value: 25,
      color: '#FFCE5C', // Happy (Green)
      gradientCenterColor: '#FFCE5C',
      text: 'Happy',
      emoji: Happy,
      bgColor: '#EFE497',
    },
    {
      value: 20,
      color: '#BDA193', // Neutral (Purple)
      gradientCenterColor: '#BDA193',
      text: 'Neutral',
      emoji: Neutral,
      bgColor: '#e0d6d0',
    },
    {
      value: 15,
      color: '#FE814B', // Sad (Red)
      gradientCenterColor: '#FE814B',
      text: 'Sad',
      emoji: Sad,
      bgColor: '#f2c3af',
    },
    {
      value: 10,
      color: '#A18FFF', // Depressed (Orange)
      gradientCenterColor: '#A18FFF',
      text: 'Depressed',
      emoji: Depressed,
      bgColor: '#d3ccf6',
    },
  ];

  const centerText = {
    value: '30%',
    label: 'Excellent',
  };
  return (
    <>
      <SafeAreaView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50,
          paddingTop: 20,
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
          <RNText variant="title" size="xl">
            Analytics
          </RNText>
        </View>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Colors.brown,
            padding: 12,
            borderRadius: 30,
          }}
        >
          <Notification />
        </TouchableOpacity>
      </SafeAreaView>
      <ScrollView style={{ flex: 1, paddingTop: 10 }}>
        <View
          style={{
            width: '90%',

            marginHorizontal: 'auto',
            backgroundColor: Colors.white,
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 30,
            gap: 20,
            alignItems: 'center',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
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
              style={{ height: 80, width: 80, overflow: 'hidden' }}
            />
          </View>
          <View style={{ gap: 5 }}>
            <RNText variant="header" size="2xl" style={{ color: Colors.brown }}>
              Hi, Selena!
            </RNText>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Calendar size={18} stroke={Colors.orange} />
              <RNText
                variant="medium"
                size="md"
                style={{ color: Colors.orange }}
              >
                Tue, 30 Feb 2026
              </RNText>
            </View>
          </View>
        </View>
        <View
          style={{ width: '90%', marginHorizontal: 'auto', marginVertical: 30 }}
        >
          <View style={{ gap: 10 }}>
            <RNText variant="title" size="4xl">
              Your Insights
            </RNText>
            <RNText variant="base" size="lg">
              Track your emotinal wellness journey
            </RNText>
          </View>
          <View style={{ marginVertical: 20, gap: 20 }}>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  gap: 5,
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    padding: 12,
                    backgroundColor: '#FF8D28',
                    alignSelf: 'flex-start',
                    borderRadius: 12,
                  }}
                >
                  <Calendar size={24} stroke={Colors.white} />
                </View>
                <RNText variant="title" size="lg">
                  Total Entries
                </RNText>
                <RNText variant="header" size="3xl">
                  45
                </RNText>
                <RNText>This Month</RNText>
              </View>
              <View
                style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  gap: 5,
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    padding: 12,
                    backgroundColor: '#FFCC00',
                    alignSelf: 'flex-start',
                    borderRadius: 12,
                  }}
                >
                  <Smile size={24} stroke={Colors.white} />
                </View>
                <RNText variant="title" size="lg">
                  Average Mood
                </RNText>
                <RNText variant="header" size="3xl">
                  6.8 <RNText variant="base">/ 10</RNText>
                </RNText>
                <RNText>This Month</RNText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  gap: 5,
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    padding: 12,
                    backgroundColor: '#34C759',
                    alignSelf: 'flex-start',
                    borderRadius: 12,
                  }}
                >
                  <TrendingUp size={24} stroke={Colors.white} />
                </View>
                <RNText variant="title" size="lg">
                  Mood Trend
                </RNText>
                <RNText variant="header" size="3xl">
                  + 12%
                </RNText>
                <RNText>vs Last month</RNText>
              </View>
              <View
                style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  gap: 5,
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    padding: 12,
                    backgroundColor: '#FF383C',
                    alignSelf: 'flex-start',
                    borderRadius: 12,
                  }}
                >
                  <Heart size={24} stroke={Colors.white} />
                </View>
                <RNText variant="title" size="lg">
                  Best Day
                </RNText>
                <RNText variant="header" size="3xl">
                  Wed
                </RNText>
                <RNText>Avg: 8.2</RNText>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            backgroundColor: Colors.green,
            width: '90%',
            marginHorizontal: 'auto',
            padding: 24,
            alignItems: 'center',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{
              backgroundColor: '#AFC086',
              alignSelf: 'center',
              paddingVertical: 16,
              paddingHorizontal: 8,
              borderRadius: 24,
            }}
          >
            <Flame size={32} stroke={Colors.white} />
          </View>
          <View style={{ width: '60%', gap: 5 }}>
            <RNText variant="medium" size="xl" style={{ color: Colors.white }}>
              You've checked in 7 days in a row! 🎉
            </RNText>
            <RNText variant="medium" size="lg" style={{ color: Colors.white }}>
              Keep up the amazing consistency !
            </RNText>
          </View>
        </View>
        <View
          style={{ width: '90%', marginHorizontal: 'auto', marginVertical: 40 }}
        >
          <View
            style={{
              padding: 20,
              borderRadius: 20,
              alignItems: 'center',
            }}
          >
            <RNText variant="title" size="xl" style={{ marginBottom: 30 }}>
              Mood Summary
            </RNText>

            <PieChart
              data={pieData}
              donut
              focusOnPress
              innerRadius={90}
              radius={150}
              showGradient
              sectionAutoFocus
              innerCircleColor="#0F1A45"
              onPress={(item) => {
                setSelectedSlice(item.text);
              }}
              centerLabelComponent={() => {
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 26,
                        fontWeight: 'bold',
                      }}
                    >
                      {centerText.value}
                    </Text>
                    <Text
                      style={{ color: 'white', fontSize: 14, marginTop: 4 }}
                    >
                      {centerText.label}
                    </Text>
                  </View>
                );
              }}
            />

            {/* Legend */}
            <View
              style={{
                marginTop: 25,
                gap: 20,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {pieData.map((item, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    borderWidth: 1,
                    borderColor: Colors.white,
                    padding: 15,
                    width: '47%',
                    borderRadius: 30,
                    backgroundColor:
                      selectedSlice === item.text ? item.bgColor : Colors.white,
                  }}
                >
                  <View>
                    <item.emoji height={24} width={24} />
                  </View>
                  <Text style={{ color: 'black' }}>
                    {item.text}: {item.value}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default index;
