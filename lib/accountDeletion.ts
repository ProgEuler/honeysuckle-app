import { deleteMe } from "@/lib/api/auth";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

export class AppleReauthCancelled extends Error {}

const signedInWithApple = () =>
  Platform.OS === "ios" &&
  Boolean(auth().currentUser?.providerData.some((p) => p.providerId === "apple.com"));

/**
 * Apple requires apps that offer Sign in with Apple to revoke the user's
 * Apple tokens when they delete their account. That needs a fresh
 * authorization code, so the user confirms with Apple once more.
 */
async function revokeAppleSignIn() {
  let authorizationCode: string | null = null;
  try {
    ({ authorizationCode } = await AppleAuthentication.signInAsync({ requestedScopes: [] }));
  } catch (error: any) {
    if (error?.code === "ERR_REQUEST_CANCELED" || error?.code === "ERR_CANCELED") {
      throw new AppleReauthCancelled("Apple confirmation was cancelled.");
    }
    throw error;
  }
  if (!authorizationCode) return;
  try {
    await auth().revokeToken(authorizationCode);
  } catch (error) {
    // Needs the Apple provider (Services ID + private key) set up in
    // Firebase. Don't block deletion of the user's data on it.
    console.warn("Apple token revoke failed:", error);
  }
}

/**
 * Delete the account: revoke Sign in with Apple if used, delete the
 * account and its data on our server, then clear the social sign-ins
 * on this device.
 */
export async function deleteAccount() {
  if (signedInWithApple()) {
    await revokeAppleSignIn();
  }

  await deleteMe();

  // Best effort: the server account (and all data) is already gone.
  try {
    await auth().currentUser?.delete();
  } catch {
    // Firebase may require a recent sign-in; the identity has no data of ours.
  }
  await signOutSocial();
}

/** Sign out of Firebase and Google on this device. */
export async function signOutSocial() {
  try {
    if (auth().currentUser) await auth().signOut();
  } catch {
    // ignore
  }
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore
  }
}
