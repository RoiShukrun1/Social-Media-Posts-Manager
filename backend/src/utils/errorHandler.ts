/**
 * Utility functions for error handling
 */

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred";
}

/**
 * Check if error has a name property (like ZodError)
 */
export function hasErrorName(error: unknown): error is { name: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof (error as { name: unknown }).name === "string"
  );
}

/**
 * Check if error has errors property (like ZodError)
 */
export function hasErrorDetails(error: unknown): error is { errors: unknown } {
  return typeof error === "object" && error !== null && "errors" in error;
}

/**
 * Check if error has a code property (like SQLite errors)
 */
export function hasErrorCode(
  error: unknown
): error is { code: string | number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (typeof (error as { code: unknown }).code === "string" ||
      typeof (error as { code: unknown }).code === "number")
  );
}
