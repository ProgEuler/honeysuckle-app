import { authenticatedApiRequest } from "@/lib/api/authenticatedClient";
import { useAuthStore } from "@/store/useAuthStore";
import { getApp } from "@react-native-firebase/app";
import messaging, {
    FirebaseMessagingTypes,
    getInitialNotification,
    getMessaging,
    getToken,
    onMessage,
    onNotificationOpenedApp,
    onTokenRefresh,
    setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { router, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { BackHandler, PermissionsAndroid, Platform } from "react-native";
import { toast } from "sonner-native";

async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        console.log("Authorization status:", authStatus);
    }
}

async function registerFcmDevice(registrationId: string) {
    await authenticatedApiRequest("/api/fcm/device/", {
        method: "POST",
        body: {
            registration_id: registrationId,
        },
    });
}

const normalizeType = (message: FirebaseMessagingTypes.RemoteMessage) => {
    const type =
        message?.data?.notification_type ||
        message?.data?.type ||
        message?.data?.event_type ||
        "";
    return String(type).toLowerCase();
};

const getChatId = (message: FirebaseMessagingTypes.RemoteMessage) => {
    const value =
        message?.data?.conversation_id ||
        message?.data?.chat_id ||
        message?.data?.thread_id ||
        message?.data?.room_id;
    return value ? String(value) : null;
};

const getPostId = (message: FirebaseMessagingTypes.RemoteMessage) => {
    const value =
        message?.data?.post_id ||
        message?.data?.target_post_id ||
        message?.data?.target_id;
    return value ? String(value) : null;
};

const getUserId = (message: FirebaseMessagingTypes.RemoteMessage) => {
    const value =
        message?.data?.sender_id ||
        message?.data?.user_id ||
        message?.data?.actor_id ||
        message?.data?.target_user_id;
    return value ? String(value) : null;
};

const isMessageNotification = (type: string) =>
    type === "new_message" ||
    type === "chat_message" ||
    type === "message" ||
    type.includes("message");

const isPostNotification = (type: string) =>
    type === "post_like" ||
    type === "post_comment" ||
    type === "like_comment_post" ||
    type.includes("post");

const isFriendNotification = (type: string) =>
    type === "friend_request" ||
    type === "friend_accept" ||
    type.includes("friend");

const normalizePath = (value?: string | null) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\/+$/, "");

const isSameDynamicRoute = (
    pathname: string,
    routeBase: string,
    id: string,
) => {
    const normalizedBase = normalizePath(routeBase);
    const normalizedPathname = normalizePath(pathname);
    const normalizedId = normalizePath(id);

    if (
        normalizedPathname === `${normalizedBase}/${normalizedId}` ||
        normalizedPathname === `${normalizedBase}/[id]`
    ) {
        return true;
    }

    if (!normalizedPathname.startsWith(`${normalizedBase}/`)) {
        return false;
    }

    const lastSegment = normalizedPathname.split("/").pop();
    return lastSegment === normalizedId;
};

const isSameStaticRoute = (pathname: string, routePath: string) => {
    const normalizedPathname = normalizePath(pathname);
    const normalizedRoutePath = normalizePath(routePath);
    return (
        normalizedPathname === normalizedRoutePath ||
        normalizedPathname === `${normalizedRoutePath}/index`
    );
};

const shouldSkipForegroundToast = (
    message: FirebaseMessagingTypes.RemoteMessage,
    currentPathname?: string,
) => {
    const type = normalizeType(message);
    if (!isMessageNotification(type)) {
        return false;
    }
    const chatId = getChatId(message);
    if (!chatId) {
        return false;
    }
    return isSameDynamicRoute(normalizePath(currentPathname), "/inbox", chatId);
};

const COLD_START_BASE_ROUTE = "/(drawer)/(tabs)/explore";

const navigateFromNotification = (
    message: FirebaseMessagingTypes.RemoteMessage,
    currentPathname?: string,
    replace = false,
) => {
    const navigate = (pathname: string, params?: object) => {
        if (replace) {
            router.replace(COLD_START_BASE_ROUTE as any);
            setTimeout(() => {
                router.push(
                    params ? { pathname: pathname as any, params } : (pathname as any),
                );
            }, 0);
        } else {
            router.push(
                params ? { pathname: pathname as any, params } : (pathname as any),
            );
        }
    };

    const type = normalizeType(message);
    const normalizedCurrentPath = normalizePath(currentPathname);
    const senderNameRaw =
        message?.data?.sender_name ||
        message?.data?.sender_username ||
        message?.notification?.title ||
        "Chat";
    const senderAvatarRaw =
        message?.data?.sender_avatar || message?.data?.avatar || "";
    const senderName =
        typeof senderNameRaw === "string" || typeof senderNameRaw === "number"
            ? String(senderNameRaw)
            : "Chat";
    const senderAvatar =
        typeof senderAvatarRaw === "string" || typeof senderAvatarRaw === "number"
            ? String(senderAvatarRaw)
            : "";

    if (isMessageNotification(type)) {
        const chatId = getChatId(message);
        const prettyName = senderName.includes("New message from")
            ? senderName.replace("New message from ", "")
            : senderName;

        if (chatId) {
            if (
                !replace &&
                isSameDynamicRoute(normalizedCurrentPath, "/inbox", chatId)
            ) {
                return;
            }
            navigate("/inbox/[id]", {
                id: chatId,
                name: prettyName,
                avatar: senderAvatar,
            });
            return;
        }
    }

    if (isPostNotification(type)) {
        const postId = getPostId(message);
        if (postId) {
            if (
                !replace &&
                isSameDynamicRoute(normalizedCurrentPath, "/post", postId)
            ) {
                return;
            }
            navigate("/post/[id]", { id: postId });
            return;
        }
    }

    if (isFriendNotification(type)) {
        const userId = getUserId(message);
        if (userId) {
            if (
                !replace &&
                isSameDynamicRoute(normalizedCurrentPath, "/other-profile", userId)
            ) {
                return;
            }
            navigate("/other-profile/[id]", { id: userId });
            return;
        }
    }

    if (!replace && isSameStaticRoute(normalizedCurrentPath, "/notification")) {
        return;
    }

    navigate("/notification");
};

const app = getApp();
const app_message = getMessaging(app);

setBackgroundMessageHandler(app_message, async (remoteMessage) => {
    console.log("Received background message:", remoteMessage);
});

export function useNotificationHook() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const hasHandledInitialOpenRef = useRef(false);
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);

    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    useEffect(() => {
        const setupPermissions = async () => {
            if (Platform.OS === "android" && Platform.Version >= 33) {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                );
            }
            await requestUserPermission();
        };
        setupPermissions();
    }, []);

    useEffect(() => {
        if (Platform.OS !== "android") return;

        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            if (router.canGoBack()) {
                router.back();
                return true;
            }
            router.replace(COLD_START_BASE_ROUTE as any);
            return true;
        });

        return () => sub.remove();
    }, []);

    useEffect(() => {
        const unsub = onMessage(app_message, async (remoteMessage) => {
            console.log("Received foreground message:", remoteMessage);

            if (shouldSkipForegroundToast(remoteMessage, pathnameRef.current)) {
                return;
            }

            toast.success(remoteMessage.notification?.title || "New Notification", {
                description: remoteMessage.notification?.body || "",
                duration: 5000,
                onPress: () => {
                    navigateFromNotification(remoteMessage, pathnameRef.current);
                },
            });
        });
        return () => {
            unsub();
        };
    }, []);

    useEffect(() => {
        let tokenRefreshUnsubscribe: (() => void) | undefined;

        const setupTokenHandling = async () => {
            try {
                await messaging().registerDeviceForRemoteMessages();

                const token = await getToken(app_message);
                console.log("FCM Token:", token);

                if (accessToken && token) {
                    try {
                        await registerFcmDevice(token);
                        console.log("FCM token registered in backend : ", token);
                    } catch (error) {
                        console.log("FCM token registration failed:", error);
                    }
                }

                tokenRefreshUnsubscribe = onTokenRefresh(
                    app_message,
                    async (nextToken) => {
                        console.log("FCM Token refreshed:", nextToken);
                        if (!accessToken || !nextToken) {
                            return;
                        }
                        try {
                            await registerFcmDevice(nextToken);
                            console.log("Refreshed FCM token registered in backend");
                        } catch (error) {
                            console.log("Refreshed FCM token registration failed:", error);
                        }
                    },
                );
            } catch (error) {
                console.log("FCM setup failed:", error);
            }
        };

        setupTokenHandling();

        return () => {
            tokenRefreshUnsubscribe?.();
        };
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const unsubscribeOpened = onNotificationOpenedApp(
            app_message,
            (remoteMessage) => {
                if (!remoteMessage) {
                    return;
                }
                navigateFromNotification(remoteMessage, pathnameRef.current);
            },
        );

        const handleInitialNotification = async () => {
            if (hasHandledInitialOpenRef.current) {
                return;
            }
            const initial = await getInitialNotification(app_message);
            if (!initial) {
                return;
            }
            hasHandledInitialOpenRef.current = true;
            navigateFromNotification(initial, pathnameRef.current, true);
        };

        handleInitialNotification();

        return () => {
            unsubscribeOpened();
        };
    }, [accessToken]);
}
