import { BackButton } from "@/components/ui/BackButton";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

type HeaderBackProps = {
  title: string;
  progressText?: string;
  onBackPress?: () => void;
  rightElement?: ReactNode;
  edges?: readonly Edge[];
};

type HeaderBackScrollContextValue = {
  isScrolled: boolean;
  setIsScrolled: (value: boolean) => void;
};

const HeaderBackScrollContext =
  createContext<HeaderBackScrollContextValue | null>(null);

type HeaderBackProviderProps = {
  children: ReactNode;
};

export const HeaderBackProvider = ({ children }: HeaderBackProviderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const value = useMemo(() => ({ isScrolled, setIsScrolled }), [isScrolled]);

  return (
    <HeaderBackScrollContext.Provider value={value}>
      {children}
    </HeaderBackScrollContext.Provider>
  );
};

export const HeaderBackScrollView = ({
  onScroll,
  scrollEventThrottle = 16,
  ...props
}: ScrollViewProps) => {
  const scrollContext = useContext(HeaderBackScrollContext);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (scrollContext) {
      scrollContext.setIsScrolled(event.nativeEvent.contentOffset.y > 4);
    }

    if (onScroll) {
      onScroll(event);
    }
  };

  return (
    <ScrollView
      {...props}
      onScroll={handleScroll}
      scrollEventThrottle={scrollEventThrottle}
    />
  );
};

const HeaderBack = ({
  title,
  progressText,
  onBackPress,
  rightElement,
  edges = ["top"],
}: HeaderBackProps) => {
  const scrollContext = useContext(HeaderBackScrollContext);
  const showBottomBorder = scrollContext?.isScrolled ?? false;

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.safeArea,
        showBottomBorder ? styles.safeAreaScrolled : null,
      ]}
    >
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <BackButton onPress={onBackPress} />
          <RNText variant="title" size="xl">
            {title}
          </RNText>
        </View>

        {rightElement ? (
          rightElement
        ) : progressText ? (
          <View style={styles.badge}>
            <RNText variant="title" size="sm" style={styles.badgeText}>
              {progressText}
            </RNText>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
  },
  safeAreaScrolled: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.brown,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
   //  marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  leftSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
  },
  badge: {
    backgroundColor: "#E8DDD9",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
  },
  badgeText: {
    color: "#926247",
  },
});

export default HeaderBack;
