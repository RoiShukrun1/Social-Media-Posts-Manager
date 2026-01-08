import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      {post.image_svg ? (
        <div
          className="w-full h-64 flex items-center justify-center text-white text-2xl font-semibold"
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
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">{post.author.first_name} {post.author.last_name}</h3>
          <p className="text-sm text-gray-600">{post.author.job_title} at {post.author.company}</p>
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Post Text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.text}
        </p>

        {/* Date */}
        <p className="text-xs text-gray-500 mb-4">{formatDate(post.date)} • {post.date.split(' ')[0]}</p>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
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
              onClick={() => onEdit(post)}
              className="p-2 text-2xl hover:opacity-70 transition-opacity"
              aria-label="Edit post"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(post)}
              className="p-2 text-2xl hover:opacity-70 transition-opacity"
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
