/**
 * List of available post categories
 * These categories match the actual data in the CSV
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
