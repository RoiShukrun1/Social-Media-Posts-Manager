export default function LoadingSkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="status"
      aria-live="polite"
      aria-label="Loading posts"
    >
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-card shadow-card p-6 animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>

          {/* Category badge skeleton */}
          <div className="h-6 w-24 bg-gray-200 rounded-full mb-3"></div>

          {/* Text skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Author skeleton */}
          <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="flex justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Date skeleton */}
          <div className="h-3 bg-gray-200 rounded w-40 mb-4"></div>

          {/* Buttons skeleton */}
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
            <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
