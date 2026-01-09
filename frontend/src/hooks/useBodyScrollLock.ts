/**
 * useBodyScrollLock
 * 
 * Custom React hook to prevent body scroll when modals are open.
 * Prevents background scrolling while overlay content is displayed.
 */

import { useEffect } from "react";

/**
 * Custom hook to prevent body scroll when a modal is open
 * Useful for preventing background scroll when modals are displayed
 */
export function useBodyScrollLock() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
}
