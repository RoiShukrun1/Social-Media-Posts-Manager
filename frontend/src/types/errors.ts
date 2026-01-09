/**
 * Type definitions for error handling
 */

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  error?: string;
  details?: unknown;
  message?: string;
}

/**
 * Mutation error from API calls
 */
export interface MutationError extends Error {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
  message: string;
}

/**
 * Type guard to check if error is a MutationError
 */
export function isMutationError(error: unknown): error is MutationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as MutationError).message === "string"
  );
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isMutationError(error)) {
    return error.response?.data?.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred";
}
