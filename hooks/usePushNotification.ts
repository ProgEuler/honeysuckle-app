import { authenticatedApiRequest } from "@/lib/api/authenticatedClient";
import { useAuthStore } from "@/store/useAuthStore";
import { getApp } from "@react-native-firebase/app";
import {
    AuthorizationStatus,
    FirebaseMessagingTypes,
    getInitialNotification,
    getMessaging,
    getToken,
    onMessage,
    onNotificationOpenedApp,
    onTokenRefresh,
    requestPermission,
    setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { router, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { BackHandler, PermissionsAndroid, Platform } from "react-native";
import { toast } from "sonner-native";

async function requestUserPermission(messagingInstance: ReturnType<typeof getMessaging>) {
    const authStatus = await requestPermission(messagingInstance);
    const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;
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

// This app's pushes are reminders, streaks and insights; they all live on
// the notifications screen.
const NOTIFICATIONS_ROUTE = "/notifications";
const COLD_START_BASE_ROUTE = "/(tabs)/home";

const normalizePath = (value?: string | null) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\/+$/, "");

const navigateFromNotification = (
    _message: FirebaseMessagingTypes.RemoteMessage,
    currentPathname?: string,
    replace = false,
) => {
    if (replace) {
        // Cold start: put Home underneath so Back has somewhere to go.
        router.replace(COLD_START_BASE_ROUTE as any);
        setTimeout(() => router.push(NOTIFICATIONS_ROUTE as any), 0);
        return;
    }
    if (normalizePath(currentPathname) === NOTIFICATIONS_ROUTE) {
        return;
    }
    router.push(NOTIFICATIONS_ROUTE as any);
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
            await requestUserPermission(app_message);
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
                // Note: registerDeviceForRemoteMessages() is intentionally
                // omitted — RN Firebase auto-registers on iOS by default
                // (controlled by `messaging_ios_auto_register_for_remote_messages`
                // in firebase.json, which isn't present here so the default
                // applies). Calling it explicitly triggers a warning.
                const token = await getToken(app_message);
                if (accessToken && token) {
                    try {
                        await registerFcmDevice(token);
                    } catch (error) {
                        console.log("FCM token registration failed:", error);
                    }
                }

                tokenRefreshUnsubscribe = onTokenRefresh(
                    app_message,
                    async (nextToken) => {
                        if (!accessToken || !nextToken) {
                            return;
                        }
                        try {
                            await registerFcmDevice(nextToken);
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
