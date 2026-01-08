import { useQuery } from "@tanstack/react-query";
import { getStats } from "../services/api";

export default function StatsHeader() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  if (isLoading) {
    return (
      <div className="pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${Math.floor(num / 1000)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="pt-8">
      {/* Header in white container */}
      <div className="bg-white rounded-xl p-6 mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Social Media Posts
          </h1>
          <p className="text-gray-600">
            Browse and manage all social media posts with advanced filtering
          </p>
        </div>
        <button
          onClick={() =>
            window.dispatchEvent(new CustomEvent("openAddPostModal"))
          }
          className="px-6 py-3 bg-[#48BB78] text-white rounded-lg font-semibold hover:bg-[#38A169] transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="text-lg">➕</span>
          Add New Post
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Posts"
          value={stats?.totalPosts ? stats.totalPosts.toLocaleString() : "0"}
        />
        <StatCard
          title="Total Likes"
          value={stats?.totalLikes ? formatNumber(stats.totalLikes) : "0"}
        />
        <StatCard
          title="Total Comments"
          value={stats?.totalComments ? formatNumber(stats.totalComments) : "0"}
        />
        <StatCard
          title="Avg Engagement"
          value={
            stats?.avgEngagementRate
              ? `${stats.avgEngagementRate.toFixed(1)}%`
              : "0%"
          }
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-6">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
