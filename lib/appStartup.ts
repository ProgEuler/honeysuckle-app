/**
 * Whether the splash screen has finished checking the saved session since
 * the app started. Until then, the start route sends everyone to the splash;
 * afterwards it routes straight by session (e.g. after sign-in or sign-out).
 */
let startupComplete = false;

export const markStartupComplete = () => {
  startupComplete = true;
};

export const isStartupComplete = () => startupComplete;
