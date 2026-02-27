import Back from '@/assets/svgs/back.svg';
import { BackButton } from '@/components/ui/BackButton';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  const [previousService, setPreviousService] = useState(true);
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
              1 OF 4
            </RNText>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        <View>
          <View
            style={{
              borderRadius: 60,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('@/assets/images/26939.png')}
              style={{ height: 286, width: 286, borderRadius: 600 }}
            />
          </View>
          <View
            style={{ width: '90%', marginHorizontal: 'auto', marginTop: 50 }}
          >
            <RNText variant="title" size="3xl" style={{ textAlign: 'center' }}>
              Have you sought professional help before?
            </RNText>
          </View>
          <View
            style={{
              width: '90%',
              marginHorizontal: 'auto',
              marginTop: 50,
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setPreviousService(true)}
              style={{
                backgroundColor: previousService ? Colors.green : Colors.white,
                flex: 1,
                borderRadius: 30,
              }}
            >
              <RNText
                variant="title"
                size="lg"
                style={{
                  textAlign: 'center',
                  color: previousService ? Colors.white : Colors.brown,
                  paddingVertical: 13,
                }}
              >
                Yes
              </RNText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPreviousService(false)}
              style={{
                backgroundColor: previousService ? Colors.white : Colors.green,
                flex: 1,
                borderRadius: 30,
              }}
            >
              <RNText
                variant="title"
                size="lg"
                style={{
                  textAlign: 'center',
                  color: previousService ? Colors.brown : Colors.white,
                  paddingVertical: 13,
                }}
              >
                No
              </RNText>
            </TouchableOpacity>
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
                path={'/(tabs)/dailycheck/emotiontype'}
                // tag={'replace'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default index;
