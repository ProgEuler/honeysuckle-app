import { useCallback, useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { requireOptionalNativeModule } from "expo";
import { toast } from "sonner-native";
import type {
  ExpoSpeechRecognitionErrorEvent,
  ExpoSpeechRecognitionResultEvent,
} from "expo-speech-recognition";

export interface UseSpeechToTextOptions {
  lang?: string;
  onTranscript?: (fullText: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

/**
 * Safely resolve the native module without throwing fatal exceptions
 * if the app hasn't been recompiled yet with the new native pod.
 */
function getNativeSpeechModule(): any {
  try {
    return requireOptionalNativeModule("ExpoSpeechRecognition") ?? null;
  } catch {
    return null;
  }
}

export function useSpeechToText(options: UseSpeechToTextOptions = {}) {
  const { lang = "en-US", onTranscript, onError } = options;
  const [isListening, setIsListening] = useState(false);
  const prefixRef = useRef("");
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // Subscribe to native events safely
  useEffect(() => {
    const mod = getNativeSpeechModule();
    if (!mod || typeof mod.addListener !== "function") {
      return;
    }

    const startSub = mod.addListener("start", () => {
      setIsListening(true);
    });

    const endSub = mod.addListener("end", () => {
      setIsListening(false);
    });

    const resultSub = mod.addListener(
      "result",
      (event: ExpoSpeechRecognitionResultEvent) => {
        const transcript = event.results?.[0]?.transcript ?? "";
        if (transcript) {
          const fullText = prefixRef.current + transcript;
          onTranscriptRef.current?.(fullText, event.isFinal);
        }
      },
    );

    const errorSub = mod.addListener(
      "error",
      (event: ExpoSpeechRecognitionErrorEvent) => {
        setIsListening(false);
        // Ignore expected timeouts or user aborts
        if (event.error === "no-speech" || event.error === "aborted") {
          return;
        }

        if (event.error === "not-allowed") {
          toast.error(
            "Microphone or speech recognition permission was denied. Please allow it in settings.",
          );
        } else if (event.error === "network") {
          toast.error("Network issue with speech recognition. Please try again.");
        } else {
          toast.error(event.message || "Speech recognition error occurred.");
        }

        onErrorRef.current?.(event.message || event.error);
      },
    );

    return () => {
      startSub?.remove?.();
      endSub?.remove?.();
      resultSub?.remove?.();
      errorSub?.remove?.();
    };
  }, []);

  const startListening = useCallback(
    async (existingText: string = ""): Promise<boolean> => {
      try {
        const mod = getNativeSpeechModule();
        if (!mod || typeof mod.start !== "function") {
          toast.error(
            "Speech recognition requires rebuilding the native app. Run 'npx expo run:ios' in your terminal.",
          );
          return false;
        }

        const isAvailable =
          typeof mod.isRecognitionAvailable === "function"
            ? mod.isRecognitionAvailable()
            : true;

        if (!isAvailable) {
          toast.error("Speech recognition is not available on this device.");
          return false;
        }

        // Request permissions
        const perms = await mod.requestPermissionsAsync();
        if (!perms?.granted) {
          toast.error(
            "Microphone and speech recognition permissions are required to use voice input.",
          );
          return false;
        }

        // Store existing text prefix so user speech is appended cleanly
        const trimmed = existingText.trim();
        prefixRef.current = trimmed.length > 0 ? `${trimmed} ` : "";

        // Provide tactile feedback
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch {
          // ignore
        }

        mod.start({
          lang,
          interimResults: true,
          continuous: true,
          addsPunctuation: true,
        });

        setIsListening(true);
        return true;
      } catch (err: any) {
        setIsListening(false);
        toast.error(err?.message || "Failed to start speech recognition.");
        return false;
      }
    },
    [lang],
  );

  const stopListening = useCallback(() => {
    try {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // ignore
      }
      const mod = getNativeSpeechModule();
      mod?.stop?.();
    } catch {
      // ignore
    } finally {
      setIsListening(false);
    }
  }, []);

  const abortListening = useCallback((restoreOriginalText?: () => void) => {
    try {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // ignore
      }
      const mod = getNativeSpeechModule();
      mod?.abort?.();
    } catch {
      // ignore
    } finally {
      setIsListening(false);
      restoreOriginalText?.();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        const mod = getNativeSpeechModule();
        mod?.abort?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    abortListening,
    isSupported: Boolean(getNativeSpeechModule()),
    getPrefixText: () => prefixRef.current,
  };
}
