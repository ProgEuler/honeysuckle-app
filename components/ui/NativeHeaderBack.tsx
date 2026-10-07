import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

/**
 * Explicit back button for a native `UINavigationBar`'s `headerLeft` slot.
 *
 * The system chevron only appears automatically when the previous route is
 * inside the same native-stack as the current screen. Many of our detail
 * screens live in a sibling `_layout.tsx` from the tab that pushed them,
 * so the system chevron is hidden. This component guarantees a visible
 * back affordance that:
 *   1. Pops the back stack when there is one (`router.canGoBack()`).
 *   2. Otherwise navigates to Home as a safe fallback.
 */
export const NativeHeaderBack = () => (
    <TouchableOpacity
        onPress={() => {
            if (router.canGoBack()) {
                router.back();
                return;
            }

            router.replace("/(tabs)/home");
        }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={{
            marginLeft: -6,
            paddingHorizontal: 8,
            paddingVertical: 4,
        }}
    >
        <ChevronLeft size={28} color="#4B3425" />
    </TouchableOpacity>
);

export default NativeHeaderBack;
