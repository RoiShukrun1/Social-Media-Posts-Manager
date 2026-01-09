/**
 * useEscapeKey
 * 
 * Custom React hook for handling Escape key press events.
 * Commonly used for closing modals and dialogs.
 */

import { useEffect } from "react";

/**
 * Custom hook to handle Escape key press
 * @param onEscape - Callback function to execute when Escape is pressed
 * @param enabled - Whether the hook is enabled (default: true)
 */
export function useEscapeKey(onEscape: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onEscape, enabled]);
}
