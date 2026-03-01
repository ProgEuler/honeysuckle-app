import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Thin: require('@/assets/fonts/Urbanist-Thin.ttf'),
    ExtraLight: require('@/assets/fonts/Urbanist-ExtraLight.ttf'),
    Light: require('@/assets/fonts/Urbanist-Light.ttf'),
    Regular: require('@/assets/fonts/Urbanist-Regular.ttf'),
    Medium: require('@/assets/fonts/Urbanist-Medium.ttf'),
    SemiBold: require('@/assets/fonts/Urbanist-SemiBold.ttf'),
    Bold: require('@/assets/fonts/Urbanist-Bold.ttf'),
    ExtraBold: require('@/assets/fonts/Urbanist-ExtraBold.ttf'),
    Black: require('@/assets/fonts/Urbanist-Black.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log('All fonts loaded');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
      <KeyboardProvider>
         <StatusBar barStyle="dark-content" backgroundColor={'transparent'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </KeyboardProvider>
  );
}
