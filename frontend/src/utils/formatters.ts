// Time constants
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MS_PER_DAY =
  MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

/**
 * Format a date string into a relative time format with absolute date
 * @param dateString - The date string to format
 * @returns Formatted string like "2 days ago • Dec 15, 2023"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / MS_PER_DAY);

  let relativeTime = "";
  if (diffDays === 0) relativeTime = "Today";
  else if (diffDays === 1) relativeTime = "1 day ago";
  else if (diffDays < 7) relativeTime = `${diffDays} days ago`;
  else if (diffDays < 14) relativeTime = "1 week ago";
  else if (diffDays < 30)
    relativeTime = `${Math.floor(diffDays / 7)} weeks ago`;
  else if (diffDays < 60) relativeTime = "1 month ago";
  else if (diffDays < 365)
    relativeTime = `${Math.floor(diffDays / 30)} months ago`;
  else
    relativeTime = `${Math.floor(diffDays / 365)} year${
      Math.floor(diffDays / 365) > 1 ? "s" : ""
    } ago`;

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${relativeTime} • ${formattedDate}`;
};

/**
 * Format a number with locale-specific thousands separators
 * @param num - The number to format
 * @returns Formatted string like "1,234"
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

import { DEFAULTS } from "../constants/config";

/**
 * Format a number with abbreviated notation (K for thousands, M for millions)
 * @param num - The number to format
 * @returns Formatted string like "1.5M" or "12K"
 */
export const formatNumberCompact = (num: number): string => {
  if (num >= DEFAULTS.millionThreshold) {
    return `${(num / DEFAULTS.millionThreshold).toFixed(1)}M`;
  } else if (num >= DEFAULTS.thousandThreshold) {
    return `${Math.floor(num / DEFAULTS.thousandThreshold)}K`;
  }
  return num.toLocaleString();
};
