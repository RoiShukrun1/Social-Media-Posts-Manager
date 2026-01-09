/**
 * types/errors.ts
 *
 * Error handling utilities and type definitions.
 * Provides consistent error message extraction from various error types.
 */

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  error?: string;
  details?: Array<{
    path: (string | number)[];
    message: string;
  }>;
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
    const errorData = error.response?.data;

    // If there are validation details, format them nicely
    if (errorData?.details && Array.isArray(errorData.details)) {
      const detailMessages = errorData.details
        .map((detail) => detail.message)
        .join(", ");
      return detailMessages || errorData.error || error.message;
    }

    return errorData?.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred";
}
