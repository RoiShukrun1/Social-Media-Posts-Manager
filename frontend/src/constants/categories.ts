/**
 * constants/categories.ts
 *
 * Defines available post categories for the application.
 * Categories match the actual data in the CSV and are used in filters and forms.
 */
export const CATEGORIES = [
  "Business",
  "Company News",
  "Industry Insights",
  "Marketing",
  "Product",
  "Technology",
] as const;

export type Category = (typeof CATEGORIES)[number];
