import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuthors, getTags } from '../services/api';
import { Post, CreatePostData, UpdatePostData } from '../types';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData | UpdatePostData) => void;
  post?: Post | null;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Technology',
  'Business',
  'Entertainment',
  'Health',
  'Sports',
  'Travel',
  'Food',
  'Fashion',
  'Education',
  'Science',
];

export default function PostModal({ isOpen, onClose, onSubmit, post, isLoading }: PostModalProps) {
  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: getAuthors,
  });

  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(false),
  });

  const [formData, setFormData] = useState<CreatePostData>({
    author_id: 0,
    text: '',
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    comments: 0,
    shares: 0,
    image_svg: '',
    category: 'Technology',
    location: '',
    engagement_rate: 0,
    tags: [],
  });

  useEffect(() => {
    if (!isOpen) return;
    
    if (post) {
      setFormData({
        author_id: post.author_id,
        text: post.text,
        date: post.date.split(' ')[0],
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        image_svg: post.image_svg || '',
        category: post.category,
        location: post.location,
        engagement_rate: post.engagement_rate,
        tags: post.tags,
      });
    } else if (authors.length > 0) {
      setFormData({
        author_id: authors[0].id,
        text: '',
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: 0,
        shares: 0,
        image_svg: '',
        category: 'Technology',
        location: '',
        engagement_rate: 0,
        tags: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert date to datetime format expected by backend
    const dateTime = `${formData.date} 00:00:00`;
    
    // Calculate engagement rate if not set
    const totalEngagement = formData.likes + formData.comments;
    const engagementRate = formData.engagement_rate || 
      (totalEngagement > 0 ? (totalEngagement / 1000) * 100 : 0);

    onSubmit({
      ...formData,
      date: dateTime,
      engagement_rate: engagementRate,
    });
  };

  const handleTagToggle = (tagName: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter((t) => t !== tagName)
        : [...prev.tags, tagName],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-card shadow-card-hover max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {post ? '✏️ Edit Post' : '➕ Add New Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <select
              id="author"
              value={formData.author_id}
              onChange={(e) => setFormData({ ...formData, author_id: parseInt(e.target.value) })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.first_name} {author.last_name} - {author.email}
                </option>
              ))}
            </select>
          </div>

          {/* Post Text */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              Post Text *
            </label>
            <textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="What's on your mind?"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="New York, USA"
            />
          </div>

          {/* Engagement Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="likes" className="block text-sm font-medium text-gray-700 mb-2">
                👍 Likes
              </label>
              <input
                id="likes"
                type="number"
                min="0"
                value={formData.likes}
                onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                💬 Comments
              </label>
              <input
                id="comments"
                type="number"
                min="0"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-2">
                📊 Shares
              </label>
              <input
                id="shares"
                type="number"
                min="0"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.name)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    formData.tags.includes(tag.name)
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image SVG */}
          <div>
            <label htmlFor="image_svg" className="block text-sm font-medium text-gray-700 mb-2">
              Image SVG (Optional)
            </label>
            <textarea
              id="image_svg"
              value={formData.image_svg}
              onChange={(e) => setFormData({ ...formData, image_svg: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-xs"
              placeholder="<svg>...</svg>"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-button font-medium transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-secondary text-white rounded-button font-medium transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : post ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
