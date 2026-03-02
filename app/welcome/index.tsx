import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Check } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 1,
    step: 'STEP 1',
    title: 'Personalize Your Mental Health State With AI',
    coloredWords: ['State'],
    image: require('@/assets/images/welcome-1st.png'),
    color: Colors.green,
  },
  {
    id: 2,
    step: 'STEP 2',
    title: 'Intelligent Mood Tracking & Emotion Insights',
    coloredWords: ['Intelligent'],
    image: require('@/assets/images/welcome-2nd.png'),
    color: Colors.orange,
  },
  {
    id: 3,
    step: 'STEP 3',
    title: 'Mindful Resources That Makes You Happy',
    coloredWords: ['Resources'],
    image: require('@/assets/images/welcome-3rd.png'),
    color: Colors.yellow,
  },
  {
    id: 4,
    step: 'STEP 4',
    title: 'Loving & Supportive Community',
    coloredWords: ['Community'],
    image: require('@/assets/images/welcome-4th.png'),
    color: Colors.purple,
  },
];

export default function WelcomeScreen() {
  const [showSlider, setShowSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.push('/auth');
    }
  };

  const renderTitle = (title: string, coloredWords: string[], color: string) => {
    const parts = title.split(' ');
    return (
      <RNText variant="title" size="3xl" style={styles.onboardingTitle}>
        {parts.map((part, index) => {
          const cleanPart = part.replace(/[^\w]/g, '');
          const isColored = coloredWords.some(word => cleanPart.toLowerCase() === word.toLowerCase());
          return (
            <RNText
              key={index}
              variant="title"
              size="3xl"
              style={[
                styles.onboardingTitle,
                isColored && { color: color }
              ]}
            >
              {part}{' '}
            </RNText>
          );
        })}
      </RNText>
    );
  };

  if (!showSlider) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeHeader}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
            <RNText variant="title" size="3xl" style={styles.welcomeTitle}>
              Welcome to Honeysuckle Trail
            </RNText>
            <View style={styles.subtitleWrapper}>
              <RNText variant="medium" size="md" style={styles.welcomeSubtitle}>
                A mindful mental health tool by{' '}
                <RNText variant="header" size="md">Honeysuckle Co.</RNText>
              </RNText>
              <View style={styles.checkBadge}>
                <Check color={Colors.white} size={10} strokeWidth={4} />
              </View>
            </View>
          </View>

          <View style={styles.welcomeImageContainer}>
            <View style={styles.circleBackground} />
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.welcomeIllustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.welcomeFooter}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.getStartedButton}
              onPress={() => setShowSlider(true)}
            >
              <RNText variant="header" size="lg" style={styles.getStartedText}>
                Get Started
              </RNText>
              <ArrowRight color={Colors.white} size={20} style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.signInLink}
              onPress={() => router.push('/auth')}
            >
              <RNText variant="medium" size="md" style={styles.signInText}>
                Already have an account? <RNText variant="header" size="md" style={{ color: Colors.orange }}>Sign In</RNText>
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.sliderContainer}>
      {/* <StatusBar style="dark" /> */}
      <Animated.FlatList
        ref={flatListRef}
        data={ONBOARDING_STEPS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const contentOffset = e.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffset / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.backgroundImage}
              resizeMode="cover"
            />

            <View style={styles.bottomCard}>
              <View style={[styles.stepBadge, { backgroundColor: item.color + '15' }]}>
                <RNText variant="header" size="xs" style={{ color: item.color }}>
                  {item.step}
                </RNText>
              </View>

              <View style={styles.onboardingTitleContainer}>
                {renderTitle(item.title, item.coloredWords, item.color)}
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.nextButtonCircle}
                onPress={handleNext}
              >
                <ArrowRight color={Colors.white} size={28} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Shared Pagination dots at top overlay */}
      <View style={styles.paginationOverlay}>
        {ONBOARDING_STEPS.map((_, i) => {
          const isActive = currentIndex === i;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                isActive ? styles.activeDot : styles.inactiveDot
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  welcomeHeader: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  welcomeTitle: {
    textAlign: 'center',
    color: '#1C1C1E',
  },
  subtitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  welcomeSubtitle: {
    textAlign: 'center',
    color: '#6E6E73',
  },
  checkBadge: {
    backgroundColor: '#34C759',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  circleBackground: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#FFFBE6', // Light yellow circle
  },
  welcomeIllustration: {
    width: width * 0.65,
    height: width * 0.65,
  },
  welcomeFooter: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  getStartedButton: {
    backgroundColor: Colors.brown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 100,
    width: '100%',
    shadowColor: Colors.brown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedText: {
    color: Colors.white,
    letterSpacing: 0.5,
  },
  signInLink: {
    paddingVertical: 10,
  },
  signInText: {
    color: '#6E6E73',
  },

  // Slider styles
  sliderContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height * 0.75,
  },
  paginationOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: Colors.brown,
    width: 28,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 8,
  },
  bottomCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: "30%",
    borderTopRightRadius: "30%",
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 50,
    alignItems: 'center',
    width: width,
    minHeight: height * 0.38,
  },
  stepBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  onboardingTitleContainer: {
    width: '100%',
    marginBottom: 36,
    paddingHorizontal: 10,
  },
  onboardingTitle: {
    textAlign: 'center',
    lineHeight: 44,
    color: Colors.brown,
  },
  nextButtonCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.brown,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brown,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
});
