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
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatPage = () => {
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
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingBottom: 30,
            gap: 15,
          }}
        >
          <View style={{ alignItems: 'flex-end' }}>
            <RNText
              variant="medium"
              size="md"
              style={{
                backgroundColor: Colors.brown,
                paddingVertical: 10,
                paddingHorizontal: 18,
                maxWidth: '80%',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                color: Colors.white,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                elevation: 1,
              }}
            >
              I’ve been feeling really anxious today. I have a big presentation
              tomorrow, and I’m worried I’ll mess up.
            </RNText>
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <RNText
              variant="medium"
              size="md"
              style={{
                backgroundColor: '#E8DDD9',
                paddingVertical: 10,
                paddingHorizontal: 18,
                maxWidth: '80%',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                color: Colors.brown,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                elevation: 1,
              }}
            >
              I hear you. It’s okay to feel anxious sometimes. Let’s try a quick
              grounding exercise: take a deep breath in for 4 seconds… hold… and
              exhale for 6 seconds. Want to do it together?
            </RNText>
          </View>
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

export default ChatPage;
