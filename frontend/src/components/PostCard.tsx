import { Post } from "../types";
import { formatDate, formatNumber } from "../utils/formatters";

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onView: (post: Post) => void;
}

export default function PostCard({
  post,
  onEdit,
  onDelete,
  onView,
}: PostCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
      onClick={() => onView(post)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView(post);
        }
      }}
      aria-label={`View post by ${post.author.first_name} ${post.author.last_name}`}
    >
      {/* Image */}
      {post.image_svg ? (
        <div
          className="w-full h-64 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover"
          dangerouslySetInnerHTML={{ __html: post.image_svg }}
        />
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
          {post.category}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Author */}
        <div className="mb-4 flex items-start gap-3">
          {/* Author Image Space */}
          <div className="w-10 h-10 flex-shrink-0"></div>
          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">
              {post.author.first_name} {post.author.last_name}
            </h3>
            <p className="text-sm text-gray-600">
              {post.author.job_title} at {post.author.company}
            </p>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Post Text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3 min-h-[4.5rem]">
          {post.text}
        </p>

        {/* Date */}
        <p className="text-xs text-gray-500 mb-4">{formatDate(post.date)}</p>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600 font-semibold">
            <span className="flex items-center gap-1">
              <span>👍</span> {formatNumber(post.likes)}
            </span>
            <span className="flex items-center gap-1">
              <span>💬</span> {formatNumber(post.comments)}
            </span>
            <span className="flex items-center gap-1">
              <span>📊</span> {formatNumber(post.shares)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Edit post"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post);
              }}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Delete post"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
