import Back from '@/assets/svgs/back.svg';
import { BackButton } from '@/components/ui/BackButton';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const JournalHistory = () => {
//   const [previousService, setPreviousService] = useState(true);
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
            {/* <TouchableOpacity
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor: Colors.brown,
                alignItems: 'flex-start',
                borderRadius: 40,
              }}
              onPress={() => router.back()}
            >
              <Back />
            </TouchableOpacity> */}
            <BackButton />
            <RNText variant="title" size="xl">
              Your Journal Entries
            </RNText>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: Colors.white,
            gap: 10,
            marginTop: 20,
            borderRadius: 20,
            shadowColor: Colors.orange,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <RNText variant="title" size="lg">
              Happy
            </RNText>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: '#ECEEF2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <RNText variant="subtitle" size="sm">
                  Mood: 8/10
                </RNText>
              </View>
              <RNText variant="subtitle" size="md">
                Oct 30, 2025
              </RNText>
            </View>
          </View>
          <RNText>Great day at work, productive and energized!</RNText>
        </View>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: Colors.white,
            gap: 10,
            marginTop: 20,
            borderRadius: 20,
            shadowColor: Colors.orange,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <RNText variant="title" size="lg">
              Happy
            </RNText>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: '#ECEEF2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <RNText variant="subtitle" size="sm">
                  Mood: 8/10
                </RNText>
              </View>
              <RNText variant="subtitle" size="md">
                Oct 30, 2025
              </RNText>
            </View>
          </View>
          <RNText>Great day at work, productive and energized!</RNText>
        </View>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: Colors.white,
            gap: 10,
            marginTop: 20,
            borderRadius: 20,
            shadowColor: Colors.orange,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <RNText variant="title" size="lg">
              Happy
            </RNText>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: '#ECEEF2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <RNText variant="subtitle" size="sm">
                  Mood: 8/10
                </RNText>
              </View>
              <RNText variant="subtitle" size="md">
                Oct 30, 2025
              </RNText>
            </View>
          </View>
          <RNText>Great day at work, productive and energized!</RNText>
        </View>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: Colors.white,
            gap: 10,
            marginTop: 20,
            borderRadius: 20,
            shadowColor: Colors.orange,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <RNText variant="title" size="lg">
              Happy
            </RNText>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: '#ECEEF2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <RNText variant="subtitle" size="sm">
                  Mood: 8/10
                </RNText>
              </View>
              <RNText variant="subtitle" size="md">
                Oct 30, 2025
              </RNText>
            </View>
          </View>
          <RNText>Great day at work, productive and energized!</RNText>
        </View>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: Colors.white,
            gap: 10,
            marginTop: 20,
            borderRadius: 20,
            shadowColor: Colors.orange,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <RNText variant="title" size="lg">
              Happy
            </RNText>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: '#ECEEF2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <RNText variant="subtitle" size="sm">
                  Mood: 8/10
                </RNText>
              </View>
              <RNText variant="subtitle" size="md">
                Oct 30, 2025
              </RNText>
            </View>
          </View>
          <RNText>Great day at work, productive and energized!</RNText>
        </View>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: Colors.white,
            gap: 10,
            marginTop: 20,
            borderRadius: 20,
            shadowColor: Colors.orange,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <RNText variant="title" size="lg">
              Happy
            </RNText>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: '#ECEEF2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <RNText variant="subtitle" size="sm">
                  Mood: 8/10
                </RNText>
              </View>
              <RNText variant="subtitle" size="md">
                Oct 30, 2025
              </RNText>
            </View>
          </View>
          <RNText>Great day at work, productive and energized!</RNText>
        </View>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: Colors.white,
            gap: 10,
            marginTop: 20,
            borderRadius: 20,
            shadowColor: Colors.orange,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <RNText variant="title" size="lg">
              Happy
            </RNText>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: '#ECEEF2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <RNText variant="subtitle" size="sm">
                  Mood: 8/10
                </RNText>
              </View>
              <RNText variant="subtitle" size="md">
                Oct 30, 2025
              </RNText>
            </View>
          </View>
          <RNText>Great day at work, productive and energized!</RNText>
        </View>
        <View
          style={{
            width: '90%',
            marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: Colors.white,
            gap: 10,
            marginTop: 20,
            borderRadius: 20,
            shadowColor: Colors.orange,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <RNText variant="title" size="lg">
              Happy
            </RNText>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: '#ECEEF2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
              >
                <RNText variant="subtitle" size="sm">
                  Mood: 8/10
                </RNText>
              </View>
              <RNText variant="subtitle" size="md">
                Oct 30, 2025
              </RNText>
            </View>
          </View>
          <RNText>Great day at work, productive and energized!</RNText>
        </View>
      </ScrollView>
    </>
  );
};

export default JournalHistory;
