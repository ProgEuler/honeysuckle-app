import Back from '@/assets/svgs/back.svg';
import Enter from '@/assets/svgs/enter.svg';
import Menu from '@/assets/svgs/menu.svg';
import Type from '@/assets/svgs/type.svg';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { useKeyboardVisibility } from '@/hooks/useKeyborad';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  const keyboardVisibility = useKeyboardVisibility();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <SafeAreaView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.white,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: -10,
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
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/home')}
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
            Chat with AI
          </RNText>
        </View>
        <View
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.brown,
            borderRadius: 50,
          }}
        >
          <Menu />
        </View>
      </SafeAreaView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!keyboardVisibility && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: 50,
              }}
            >
              <View>
                <Image
                  source={require('@/assets/images/flower.png')}
                  style={{ height: 250, width: 250 }}
                />
              </View>
              <View style={{ width: '70%', marginHorizontal: 'auto', gap: 15 }}>
                <RNText
                  variant="title"
                  size="2xl"
                  style={{ textAlign: 'center' }}
                >
                  Healing Space with AI
                </RNText>
                <RNText
                  variant="medium"
                  size="md"
                  style={{ textAlign: 'center', lineHeight: 25 }}
                >
                  A supportive AI-powered journal helping users track emotions
                  and improve wellbeing.
                </RNText>
              </View>
            </View>
          )}
        </ScrollView>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            backgroundColor: Colors.white,
            paddingHorizontal: 20,
            paddingBottom: keyboardVisibility ? 15 : 40,
            paddingTop: 20,
            gap: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.green,
              borderRadius: 30,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: Colors.background,
            }}
          >
            <Type />
            <TextInput
              placeholder={'Type to start chatting...'}
              placeholderTextColor={Colors.primaryText}
              autoCorrect={false}
              autoCapitalize="words"
              spellCheck={false}
              style={{
                flex: 1,
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderRadius: 10,
                fontSize: 18,
                fontFamily: 'PoppinsRegular',
                backgroundColor: Colors.background,
                color: Colors.brown,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push('/chatpages/chatpage')}
            style={{
              backgroundColor: Colors.green,
              alignSelf: 'flex-start',
              padding: 12,
              borderRadius: 100,
            }}
          >
            <Enter />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default index;
