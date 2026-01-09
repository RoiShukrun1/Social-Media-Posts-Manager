import { Toaster } from "react-hot-toast";
import { TOAST_CONFIG } from "../constants/config";

/**
 * Toast notification provider component
 * Wraps the react-hot-toast Toaster with application-specific configuration
 */
export default function ToastProvider() {
  return (
    <Toaster position={TOAST_CONFIG.position} toastOptions={TOAST_CONFIG} />
  );
}
