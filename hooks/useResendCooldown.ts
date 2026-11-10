import { useCallback, useEffect, useState } from "react";

/** Countdown that blocks "Resend code" for a while after each send. */
export function useResendCooldown(seconds = 30) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const restart = useCallback(() => setSecondsLeft(seconds), [seconds]);

  return { secondsLeft, canResend: secondsLeft <= 0, restart };
}
