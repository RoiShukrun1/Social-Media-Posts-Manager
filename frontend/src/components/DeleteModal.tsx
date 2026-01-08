import { Post } from '../types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  post: Post | null;
  isLoading?: boolean;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, post, isLoading }: DeleteModalProps) {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-card shadow-card-hover max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 text-2xl mb-4">
            🗑️
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Post</h2>
          
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 line-clamp-3">{post.text}</p>
            <p className="text-xs text-gray-500 mt-2">
              By {post.author.first_name} {post.author.last_name}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-button font-medium transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-2 bg-red-500 text-white rounded-button font-medium transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
