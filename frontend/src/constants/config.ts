/**
 * constants/config.ts
 * 
 * Application-wide configuration constants.
 * Centralizes colors, defaults, timing, and toast notification settings.
 */

/**
 * Color palette used throughout the application
 */
export const COLORS = {
  // Primary colors (blue)
  primary: "#4299E1",
  primaryHover: "#3182CE",

  // Success colors (green)
  success: "#48BB78",
  successHover: "#38A169",

  // Error colors (red)
  error: "#EF4444",
  errorHover: "#DC2626",
  errorBorder: "#EF4444",

  // Neutral colors
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Background
  background: "#F5F7FA",

  // Gradients
  gradient: {
    blue: "from-blue-400 via-blue-500 to-purple-600",
  },
} as const;

/**
 * Default values used across the application
 */
export const DEFAULTS = {
  // Author defaults
  followerCount: 10000,

  // Pagination
  pageSize: 20,
  paginationVisible: 5,

  // Timing
  debounceMs: 500,
  focusDelayMs: 100,

  // Number formatting thresholds
  millionThreshold: 1000000,
  thousandThreshold: 1000,

  // Calculation constants
  percentageMultiplier: 100,
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Toast notification configuration
 */
export const TOAST_CONFIG = {
  position: "top-right" as const,
  duration: 4000,
  style: {
    background: "#fff",
    color: COLORS.gray[700],
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  success: {
    iconTheme: {
      primary: COLORS.success,
      secondary: "#fff",
    },
  },
  error: {
    iconTheme: {
      primary: COLORS.error,
      secondary: "#fff",
    },
  },
} as const;
