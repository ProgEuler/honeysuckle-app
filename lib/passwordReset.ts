/**
 * Token from a verified password-reset code, kept in memory only for the
 * "choose a new password" step. It is deliberately not saved as a signed-in
 * session: that would sign the user in (and leave the auth screens) before
 * they've set the new password.
 */
let resetAccessToken: string | null = null;

export const setPasswordResetToken = (token: string) => {
  resetAccessToken = token;
};

export const getPasswordResetToken = () => resetAccessToken;

export const clearPasswordResetToken = () => {
  resetAccessToken = null;
};
