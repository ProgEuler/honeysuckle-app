import { ClearChatHistoryModal } from "@/components/chat/ClearChatHistoryModal";
import { Colors } from "@/constants/color";
import { Stack } from "expo-router";
import { Menu } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

/**
 * The Chat tab: native header (blur, brown tint, no back button since it's a
 * tab) with a menu that opens the clear-history modal. The modal state lives
 * here so the header and modal can share it.
 */
const ChatTabLayout = () => {
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

export default ChatTabLayout;
