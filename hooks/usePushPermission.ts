import { getApp } from "@react-native-firebase/app";
import {
    AuthorizationStatus,
    getMessaging,
    hasPermission,
    requestPermission,
} from "@react-native-firebase/messaging";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking, PermissionsAndroid, Platform } from "react-native";

const messaging = getMessaging(getApp());

const isEnabledStatus = (status: number) =>
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL;

export function usePushPermission() {
    // null while the first check is in flight, so the banner doesn't flash.
    const [enabled, setEnabled] = useState<boolean | null>(null);

    const refresh = useCallback(async () => {
        try {
            const status = await hasPermission(messaging);
            setEnabled(isEnabledStatus(status));
        } catch (error) {
            console.log("Push permission check failed:", error);
        }
    }, []);

    useEffect(() => {
        refresh();
        // Re-check when the user returns from system settings.
        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") refresh();
        });
        return () => sub.remove();
    }, [refresh]);

    const enable = useCallback(async () => {
        try {
            if (Platform.OS === "android") {
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.check(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    );
                    if (!granted) {
                        const result = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                        );
                        if (result === PermissionsAndroid.RESULTS.GRANTED) {
                            await refresh();
                            return;
                        }
                    }
                }
            } else {
                const status = await hasPermission(messaging);
                if (status === AuthorizationStatus.NOT_DETERMINED) {
                    const next = await requestPermission(messaging);
                    setEnabled(isEnabledStatus(next));
                    return;
                }
            }
            // Permanently denied or turned off in system settings: the OS
            // won't show the prompt again, so send the user to settings.
            await Linking.openSettings();
        } catch (error) {
            console.log("Push permission request failed:", error);
        }
    }, [refresh]);

    return { enabled, enable, refresh };
}
