import type { AuthUserLog, SignInResponse } from "@/lib/api/auth";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const secureStorage: StateStorage = {
  getItem: async (name) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name, value) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    await SecureStore.deleteItemAsync(name);
  },
};

type AuthUser = AuthUserLog;

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setAuthSession: (session: SignInResponse) => void;
  /**
   * Replace just the tokens, keeping the existing user object. Used by
   * the token-refresh flow where the user object hasn't changed but the
   * access (and possibly refresh) token has been rotated.
   */
  setTokens: (next: { access: string; refresh?: string | null }) => void;
  setUserProfile: (user: AuthUser | null) => void;
  clearAuthSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuthSession: (session) =>
        set({
          accessToken: session.access,
          refreshToken: session.refresh,
          user: session.log,
        }),
      setTokens: ({ access, refresh }) =>
        set((state) => ({
          accessToken: access,
          refreshToken: refresh === undefined ? state.refreshToken : refresh,
        })),
      setUserProfile: (user) => set({ user }),
      clearAuthSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
