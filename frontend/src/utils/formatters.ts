/**
 * Format a date string into a relative time format with absolute date
 * @param dateString - The date string to format
 * @returns Formatted string like "2 days ago • Dec 15, 2023"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

/**
 * Format a number with abbreviated notation (K for thousands, M for millions)
 * @param num - The number to format
 * @returns Formatted string like "1.5M" or "12K"
 */
export const formatNumberCompact = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}K`;
  }
  return num.toLocaleString();
};
