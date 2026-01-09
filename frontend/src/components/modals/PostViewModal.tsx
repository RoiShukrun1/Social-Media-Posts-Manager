/**
 * PostViewModal
 * 
 * Read-only modal component for viewing full post details.
 * Displays post content, author information, and engagement statistics.
 */

import { useMemo } from "react";
import { Post } from "../../types";
import { formatDate, formatNumber } from "../../utils/formatters";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

interface PostViewModalProps {
  post: Post;
  onClose: () => void;
}

export default function PostViewModal({ post, onClose }: PostViewModalProps) {
  // Handle Escape key and prevent body scroll
  useEscapeKey(onClose);
  useBodyScrollLock();

  // Memoize expensive formatting operations
  const formattedDate = useMemo(() => formatDate(post.date), [post.date]);
  const formattedLikes = useMemo(() => formatNumber(post.likes), [post.likes]);
  const formattedComments = useMemo(() => formatNumber(post.comments), [post.comments]);
  const formattedShares = useMemo(() => formatNumber(post.shares), [post.shares]);

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-view-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {post.image_svg ? (
          <div
            className="w-full h-80 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden bg-gray-50 [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: post.image_svg }}
          />
        ) : (
          <div className="w-full h-80 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
            {post.category}
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Author */}
          <div className="mb-6 flex items-start gap-3">
            {/* Author Image Space */}
            <div className="w-12 h-12 flex-shrink-0"></div>
            {/* Author Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">
                {post.author.first_name} {post.author.last_name}
              </h3>
              <p className="text-sm text-gray-600">
                {post.author.job_title} at {post.author.company}
              </p>
              {post.author.email && (
                <p className="text-sm text-gray-500">{post.author.email}</p>
              )}
              {post.author.bio && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  {post.author.bio}
                </p>
              )}
            </div>
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
              {post.category}
            </span>
          </div>

          {/* Post Text - Full text visible */}
          <div className="mb-6">
            <h2
              id="post-view-title"
              className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap"
            >
              {post.text}
            </h2>
          </div>

          {/* Location if available */}
          {post.location && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <span>📍</span>
              <span>{post.location}</span>
            </div>
          )}

          {/* Date */}
          <p className="text-sm text-gray-500 mb-6">{formattedDate}</p>

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">👍</span>
              <span className="font-semibold">{formattedLikes}</span>
              <span className="text-sm text-gray-500">Likes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">💬</span>
              <span className="font-semibold">
                {formattedComments}
              </span>
              <span className="text-sm text-gray-500">Comments</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">📊</span>
              <span className="font-semibold">{formattedShares}</span>
              <span className="text-sm text-gray-500">Shares</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm text-gray-500">Engagement Rate:</span>
              <span className="font-semibold">
                {post.engagement_rate.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
