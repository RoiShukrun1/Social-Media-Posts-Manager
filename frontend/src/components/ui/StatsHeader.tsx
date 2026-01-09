/**
 * StatsHeader
 *
 * Header component displaying page title, statistics, and "Add Post" button.
 * Fetches and displays aggregate statistics: total posts, likes, comments, and average engagement.
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../services/api";
import { formatNumberCompact } from "../../utils/formatters";
import { COLORS } from "../../constants/config";

interface StatsHeaderProps {
  onAddPostClick: () => void;
}

export default function StatsHeader({ onAddPostClick }: StatsHeaderProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  // Memoize formatted statistics to avoid recalculating on every render
  const formattedStats = useMemo(() => ({
    totalPosts: stats?.totalPosts ? stats.totalPosts.toLocaleString() : "0",
    totalLikes: stats?.totalLikes ? formatNumberCompact(stats.totalLikes) : "0",
    totalComments: stats?.totalComments ? formatNumberCompact(stats.totalComments) : "0",
    avgEngagement: stats?.avgEngagementRate ? `${stats.avgEngagementRate.toFixed(1)}%` : "0%",
  }), [stats]);

  if (isLoading) {
    return (
      <div className="pt-8">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          role="status"
          aria-live="polite"
          aria-label="Loading statistics"
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-card shadow-card p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8">
      {/* Header in white container */}
      <div className="bg-white rounded-xl p-6 mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2" id="page-title">
            Social Media Posts
          </h1>
          <p className="text-gray-600">
            Browse and manage all social media posts with advanced filtering
          </p>
        </div>
        <button
          onClick={onAddPostClick}
          aria-label="Add new post"
          style={{ backgroundColor: COLORS.success }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = COLORS.successHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = COLORS.success)
          }
          className="px-6 py-3 text-white rounded-lg font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="text-lg" aria-hidden="true">
            ➕
          </span>
          Add New Post
        </button>
      </div>

      {/* Stats Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        role="region"
        aria-label="Post statistics"
      >
        <StatCard title="Total Posts" value={formattedStats.totalPosts} />
        <StatCard title="Total Likes" value={formattedStats.totalLikes} />
        <StatCard title="Total Comments" value={formattedStats.totalComments} />
        <StatCard title="Avg Engagement" value={formattedStats.avgEngagement} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="bg-white rounded-xl p-6"
      role="group"
      aria-label={`${title}: ${value}`}
    >
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900" aria-live="polite">
        {value}
      </p>
    </div>
  );
}
