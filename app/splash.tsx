import { RNText } from "@/components/ui/input";
import { navigateAfterAuth } from "@/lib/navigateAfterAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    StyleSheet,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const QUOTES = [
  { text: '"In the midst of winter, I found there was within me an invincible summer."', author: "ALBERT CAMUS" },
  { text: '"You don\'t have to control your thoughts. You just have to stop letting them control you."', author: "DAN MILLMAN" },
  { text: '"Even the darkest night will end and the sun will rise."', author: "VICTOR HUGO" },
];

// One floating bubble
const FloatingBubble = ({
  size,
  color,
  startX,
  startY,
  duration,
  delay,
  targets,
  index,
}: {
  size: number;
  color: string;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  targets: React.MutableRefObject<{ cx: number; cy: number; r: number }[]>;
  index: number;
}) => {
  const r = size / 2;
  const x = useRef(new Animated.Value(startX)).current;
  const y = useRef(new Animated.Value(startY)).current;
  // track this bubble's current center so others can avoid it
  const currentCx = useRef(startX + r);
  const currentCy = useRef(startY + r);

  useEffect(() => {
    // register initial position
    targets.current[index] = { cx: currentCx.current, cy: currentCy.current, r };

    const randomFloat = () => {
      let nextCx = 0;
      let nextCy = 0;
      const maxAttempts = 40;
      let found = false;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const cx = r + Math.random() * (width - size);
        const cy = r + Math.random() * (height - size);
        const overlaps = targets.current.some(
          (t, i) => i !== index && Math.hypot(cx - t.cx, cy - t.cy) < r + t.r + 8
        );
        if (!overlaps) {
          nextCx = cx;
          nextCy = cy;
          found = true;
          break;
        }
      }

      if (!found) {
        nextCx = r + Math.random() * (width - size);
        nextCy = r + Math.random() * (height - size);
      }

      // update our tracked position immediately so siblings avoid it
      targets.current[index] = { cx: nextCx, cy: nextCy, r };
      currentCx.current = nextCx;
      currentCy.current = nextCy;

      Animated.parallel([
        Animated.timing(x, {
          toValue: nextCx - r,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: nextCy - r,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => randomFloat());
    };

    const timeout = setTimeout(randomFloat, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ translateX: x }, { translateY: y }],
        },
      ]}
    />
  );
};

type BubbleConfig = { size: number; color: string; startX: number; startY: number; duration: number; delay: number };

// Place bubbles without initial overlap using circle collision detection
const makeBubbles = (colors: string[]): BubbleConfig[] => {
  const placed: { cx: number; cy: number; r: number }[] = [];
  const configs: BubbleConfig[] = [];
  const maxAttempts = 60;

  colors.forEach((color, i) => {
    const size = 160 + (i % 3) * 60;
    const r = size / 2;
    let startX = 0;
    let startY = 0;
    let found = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const cx = r + Math.random() * (width - size);
      const cy = r + Math.random() * (height - size);
      const overlaps = placed.some(
        (p) => Math.hypot(cx - p.cx, cy - p.cy) < r + p.r + 8
      );
      if (!overlaps) {
        startX = cx - r;
        startY = cy - r;
        placed.push({ cx, cy, r });
        found = true;
        break;
      }
    }

    // fallback: stack them if no room found
    if (!found) {
      startX = Math.random() * (width - size);
      startY = Math.random() * (height - size);
    }

    configs.push({
      size,
      color,
      startX,
      startY,
      duration: 4000 + i * 800,
      delay: i * 300,
    });
  });

  return configs;
};

// Step 1 — brown loading
const StepOne = ({ progress }: { progress: number }) => {
  const bubbles = useRef(
    makeBubbles(["#3a2820", "#3a2820", "#3a2820", "#3a2820"])
  ).current;
  const targets = useRef<{ cx: number; cy: number; r: number }[]>([]);

  return (
    <View style={[styles.screen, { backgroundColor: "#2C1D14" }]}>
      {bubbles.map((b, i) => (
        <FloatingBubble key={i} {...b} targets={targets} index={i} />
      ))}
      <View style={styles.centerContent}>
        <RNText variant="title" size="4xl" style={styles.whiteText}>
          {Math.round(progress)}%
        </RNText>
      </View>
    </View>
  );
};

// Step 2 — green fetching
const StepTwo = () => {
  const bubbles = useRef(
    makeBubbles(["rgba(255,255,255,0.25)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"])
  ).current;
  const targets = useRef<{ cx: number; cy: number; r: number }[]>([]);

  return (
    <View style={[styles.screen, { backgroundColor: "#9BB068" }]}>
      {bubbles.map((b, i) => (
        <FloatingBubble key={i} {...b} targets={targets} index={i} />
      ))}
      <View style={styles.centerContent}>
        <RNText variant="title" size="3xl" style={styles.whiteText}>
          Fetching Data...
        </RNText>
        <RNText variant="medium" size="md" style={[styles.whiteText, { opacity: 0.85, marginTop: 8 }]}>
          Shake your screen to interact!
        </RNText>
      </View>
    </View>
  );
};

// Step 3 — orange quote
const StepThree = ({ quote }: { quote: typeof QUOTES[0] }) => {
  const bubbles = useRef(
    makeBubbles(["rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.12)", "rgba(255,255,255,0.08)"])
  ).current;
  const targets = useRef<{ cx: number; cy: number; r: number }[]>([]);

  return (
    <View style={[styles.screen, { backgroundColor: "#FE631B" }]}>
      {bubbles.map((b, i) => (
        <FloatingBubble key={i} {...b} targets={targets} index={i} />
      ))}
      <View style={styles.centerContent}>
        <View style={styles.logoCircle}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <RNText variant="title" size="2xl" style={[styles.whiteText, styles.quoteText]}>
          {quote.text}
        </RNText>
        <RNText variant="medium" size="sm" style={[styles.whiteText, { opacity: 0.8, marginTop: 20, letterSpacing: 1.5 }]}>
          — {quote.author}
        </RNText>
      </View>
    </View>
  );
};

export default function SplashScreen() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const user = useAuthStore((state) => state.user);
  const quote = useRef(QUOTES[Math.floor(Math.random() * QUOTES.length)]).current;

  const fadeToNext = (nextStep: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  };

  // Step 0: count 0→100 over ~2s then advance
  useEffect(() => {
    if (step !== 0) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => fadeToNext(1), 300);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [step]);

  // Step 1: show for 1.8s then advance
  useEffect(() => {
    if (step !== 1) return;
    const t = setTimeout(() => fadeToNext(2), 1800);
    return () => clearTimeout(t);
  }, [step]);

  // Step 2: show for 2.2s then navigate
  useEffect(() => {
    if (step !== 2) return;
    const t = setTimeout(() => {
      if (user) {
        navigateAfterAuth(user);
      } else {
        router.replace("/welcome");
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {step === 0 && <StepOne progress={progress} />}
      {step === 1 && <StepTwo />}
      {step === 2 && <StepThree quote={quote} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    overflow: "hidden",
  },
  bubble: {
    position: "absolute",
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  whiteText: {
    color: "#ffffff",
    textAlign: "center",
  },
  quoteText: {
    lineHeight: 38,
    marginTop: 24,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    width: 70,
    height: 70,
  },
});
