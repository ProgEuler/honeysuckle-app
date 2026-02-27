import Analysis from '@/assets/svgs/analysis.svg';
import Clock from '@/assets/svgs/clock.svg';
import Next from '@/assets/svgs/next.svg';
import Notification from '@/assets/svgs/notification.svg';
import Chat from '@/assets/svgs/xchat.svg';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  return (
    <>
      <SafeAreaView
        style={{
          gap: 10,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,

          backgroundColor: Colors.white,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <RNText variant="header" size="lg">
              Tue, Nov 27
            </RNText>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ height: 60, width: 60 }}
            />
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              // alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.brown,
                padding: 12,
                borderRadius: 30,
                alignSelf: 'flex-end',
              }}
            >
              <Notification />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 20,
            marginHorizontal: 'auto',
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.green,
              borderRadius: 150,
              overflow: 'hidden',
              alignSelf: 'center',
            }}
          >
            <Image
              source={require('@/assets/images/person.jpg')}
              style={{ height: 80, width: 80, overflow: 'hidden' }}
            />
          </View>
          <View style={{ gap: 5, width: '70%', marginHorizontal: 'auto' }}>
            <RNText variant="header" size="2xl" style={{ color: Colors.brown }}>
              Welcome back, Selena 👋
            </RNText>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <RNText
                variant="subtitle"
                size="md"
                style={{ color: Colors.orange }}
              >
                Let’s make today better than yesterday.
              </RNText>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          width: '90%',
          marginHorizontal: 'auto',
          paddingVertical: 30,
          marginBottom: 100,
        }}
      >
        <View style={{ gap: 20 }}>
          <RNText variant="title" size="xl">
            Mental Health Metrics
          </RNText>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/dailycheck')}
            style={{
              backgroundColor: Colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderRadius: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
              elevation: 2,
            }}
          >
            <View
              style={{
                backgroundColor: '#F2F5EB',
                padding: 12,
                borderRadius: 16,
              }}
            >
              <Clock />
            </View>
            <View
              style={{
                width: '70%',
                marginHorizontal: 'auto',
                alignSelf: 'flex-start',
              }}
            >
              <RNText variant="title" size="lg">
                Start Daily Check-In
              </RNText>
              <RNText variant="medium" size="md">
                Take a moment to assess your mood.
              </RNText>
            </View>
            <View>
              <Next />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/analytics')}
            style={{
              backgroundColor: Colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderRadius: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
              elevation: 2,
            }}
          >
            <View
              style={{
                backgroundColor: '#FFF0EB',
                padding: 12,
                borderRadius: 16,
              }}
            >
              <Analysis />
            </View>
            <View
              style={{
                width: '70%',
                marginHorizontal: 'auto',
                alignSelf: 'flex-start',
              }}
            >
              <RNText variant="title" size="lg">
                View Mood Insights
              </RNText>
              <RNText variant="medium" size="md">
                Insightful graphs and mood analytics.
              </RNText>
            </View>
            <View>
              <Next />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/chat')}
            style={{
              backgroundColor: Colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderRadius: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
              elevation: 2,
            }}
          >
            <View
              style={{
                backgroundColor: '#EDEBFF',
                padding: 12,
                borderRadius: 16,
              }}
            >
              <Chat />
            </View>
            <View
              style={{
                width: '70%',
                marginHorizontal: 'auto',
                alignSelf: 'flex-start',
              }}
            >
              <RNText variant="title" size="lg">
                Chat with AI
              </RNText>
              <RNText variant="medium" size="md">
                Get emotional support and guidance.
              </RNText>
            </View>
            <View>
              <Next />
            </View>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: Colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 20,
              paddingHorizontal: 30,
              marginVertical: 20,
              borderRadius: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
              elevation: 2,
            }}
          >
            <View style={{ gap: 10 }}>
              <RNText variant="header" size="lg">
                Current Steak
              </RNText>
              <RNText variant="medium" size="lg">
                7 Days 🔥
              </RNText>
            </View>
            <View style={{ gap: 10 }}>
              <RNText variant="header" size="lg">
                Total Check-ins
              </RNText>
              <RNText variant="medium" size="lg">
                24
              </RNText>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default index;
