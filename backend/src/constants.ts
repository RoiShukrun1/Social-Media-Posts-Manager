/**
 * constants.ts
 *
 * Application constants and static values.
 * Defines HTTP status codes, default pagination settings, and SQLite error codes.
 * Used throughout the application for consistent behavior.
 */

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
 * Default values for pagination and limits
 */
export const DEFAULTS = {
  pageSize: 20,
  defaultPage: 1,
} as const;

/**
 * Database constraint error codes
 */
export const SQLITE_ERRORS = {
  CONSTRAINT_UNIQUE: "SQLITE_CONSTRAINT_UNIQUE",
  CONSTRAINT_PRIMARYKEY: "SQLITE_CONSTRAINT_PRIMARYKEY",
} as const;
