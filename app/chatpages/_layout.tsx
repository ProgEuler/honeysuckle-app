import { ClearChatHistoryModal } from "@/components/chat/ClearChatHistoryModal";
import NativeHeaderBack from "@/components/ui/NativeHeaderBack";
import { Colors } from "@/constants/color";
import { Stack } from "expo-router";
import { Menu } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

/**
 * Native-style header for the chat with AI screen, matching the other
 * native-header layouts (settings-sub-screens, dailycheck-sub-screens):
 * transparent header with `systemThinMaterial` blur, large title off,
 * no shadow, brown tint.
 *
 *   - Left:  chevron (uses NativeHeaderBack so it pops the back stack
 *            when there is one, otherwise jumps to the Home tab).
 *   - Right: menu icon that opens the clear-history modal. The modal
 *            state lives here so the header and modal can share it
 *            without prop-drilling through the chat screen.
 */
const ChatPagesLayout = () => {
    const [showClearModal, setShowClearModal] = useState(false);

    return (
        <>
            <Stack
                screenOptions={{
                    // headerTransparent: true,
                    headerBlurEffect: "systemThinMaterial",
                    headerLargeTitle: false,
                    headerShadowVisible: false,
                    headerTintColor: Colors.brown,
                    contentStyle: { backgroundColor: Colors.background },
                    headerBackButtonDisplayMode: "minimal",
                    headerLeft: () => <NativeHeaderBack />,
                    title: "Chat with AI",
                    headerRight: () => (
                        <TouchableOpacity
                            accessibilityLabel="Clear chat history"
                            accessibilityRole="button"
                            onPress={() => setShowClearModal(true)}
                            hitSlop={{
                                top: 12,
                                bottom: 12,
                                left: 12,
                                right: 12,
                            }}
                            style={{
                                marginRight: -6,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                            }}
                        >
                            <Menu size={24} color={Colors.brown} />
                        </TouchableOpacity>
                    ),
                }}
            >
                <Stack.Screen name="index" />
            </Stack>

            <ClearChatHistoryModal
                visible={showClearModal}
                onCancel={() => setShowClearModal(false)}
                onCleared={() => setShowClearModal(false)}
            />
        </>
    );
};

export default ChatPagesLayout;
