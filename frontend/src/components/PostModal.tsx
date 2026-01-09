import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTags, createAuthor, updateAuthor } from "../services/api";
import { Post, CreatePostData, UpdatePostData } from "../types";
import { CATEGORIES } from "../constants/categories";
import { COLORS, DEFAULTS } from "../constants/config";
import { useEscapeKey } from "../hooks/useEscapeKey";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData | UpdatePostData) => void;
  post?: Post | null;
  isLoading?: boolean;
}

export default function PostModal({
  isOpen,
  onClose,
  onSubmit,
  post,
  isLoading,
}: PostModalProps) {
  const { data: availableTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const [formData, setFormData] = useState<CreatePostData>({
    author_id: 0,
    text: "",
    date: new Date().toISOString().split("T")[0],
    likes: 0,
    comments: 0,
    shares: 0,
    image_svg: "",
    category: "Technology",
    location: "",
    engagement_rate: 0,
    tags: [],
  });

  const [authorData, setAuthorData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    job_title: "",
    bio: "",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    text: "",
  });

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Handle Escape key to close modal
  useEscapeKey(onClose, isOpen);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), DEFAULTS.focusDelayMs);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (post) {
      setFormData({
        author_id: post.author_id,
        text: post.text,
        date: post.date.split(" ")[0],
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        image_svg: post.image_svg || "",
        category: post.category,
        location: post.location,
        engagement_rate: post.engagement_rate,
        tags: post.tags,
      });
      setAuthorData({
        first_name: post.author.first_name,
        last_name: post.author.last_name,
        email: post.author.email,
        company: post.author.company,
        job_title: post.author.job_title,
        bio: post.author.bio,
      });
    } else {
      setFormData({
        author_id: 0,
        text: "",
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        comments: 0,
        shares: 0,
        image_svg: "",
        category: "Technology",
        location: "",
        engagement_rate: 0,
        tags: [],
      });
      setAuthorData({
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        job_title: "",
        bio: "",
      });
    }
    setErrors({
      first_name: "",
      last_name: "",
      email: "",
      text: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, post]);

  const validateForm = () => {
    const newErrors = {
      first_name: "",
      last_name: "",
      email: "",
      text: "",
    };

    if (!authorData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!authorData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!authorData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.text.trim()) {
      newErrors.text = "Post text is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const isFormValid = () => {
    return (
      authorData.first_name.trim() !== "" &&
      authorData.last_name.trim() !== "" &&
      authorData.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorData.email) &&
      formData.text.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert date to datetime format expected by backend
    const dateTime = `${formData.date} 00:00:00`;

    // Calculate engagement rate if not set
    // Formula: Standard social media engagement rate
    // engagement_rate = (total_engagements / follower_count) × 100
    const totalEngagement = (formData.likes || 0) + (formData.comments || 0);
    const engagementRate =
      formData.engagement_rate ||
      (totalEngagement > 0
        ? (totalEngagement / DEFAULTS.followerCount) *
          DEFAULTS.percentageMultiplier
        : 0);

    let authorId = formData.author_id;

    // If creating a new post and no author_id, create author first
    if (
      !post &&
      authorId === 0 &&
      authorData.first_name &&
      authorData.last_name &&
      authorData.email
    ) {
      try {
        const newAuthor = await createAuthor({
          first_name: authorData.first_name,
          last_name: authorData.last_name,
          email: authorData.email,
          company: authorData.company,
          job_title: authorData.job_title,
          bio: authorData.bio,
          follower_count: DEFAULTS.followerCount,
          verified: false,
        });
        authorId = newAuthor.id;
      } catch (error) {
        console.error("Failed to create author:", error);
        alert(
          "Failed to create author. Please check if the email already exists."
        );
        return;
      }
    }

    // If editing a post, check if author info has changed and update it
    if (post && authorId !== 0) {
      const authorChanged =
        authorData.first_name !== post.author.first_name ||
        authorData.last_name !== post.author.last_name ||
        authorData.email !== post.author.email ||
        authorData.company !== post.author.company ||
        authorData.job_title !== post.author.job_title ||
        authorData.bio !== post.author.bio;

      if (authorChanged) {
        try {
          await updateAuthor(authorId, {
            first_name: authorData.first_name,
            last_name: authorData.last_name,
            email: authorData.email,
            company: authorData.company,
            job_title: authorData.job_title,
            bio: authorData.bio,
          });
        } catch (error) {
          console.error("Failed to update author:", error);
          alert(
            "Failed to update author. Please check if the email already exists."
          );
          return;
        }
      }
    }

    onSubmit({
      ...formData,
      author_id: authorId,
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
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-card shadow-card-hover max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            {post ? "✏️ Edit Post" : "➕ Add New Post"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Author */}
          <div
            className="space-y-3"
            role="group"
            aria-labelledby="author-section-label"
          >
            <label
              id="author-section-label"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Author *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={authorData.first_name}
                  onChange={(e) => {
                    setAuthorData({
                      ...authorData,
                      first_name: e.target.value,
                    });
                    if (errors.first_name)
                      setErrors({ ...errors, first_name: "" });
                  }}
                  onBlur={(e) => {
                    if (!e.target.value.trim()) {
                      setErrors({
                        ...errors,
                        first_name: "First name is required",
                      });
                    }
                  }}
                  placeholder="First Name"
                  style={{ borderColor: errors.first_name ? COLORS.errorBorder : COLORS.gray[300] }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.first_name && (
                  <p
                    id="first-name-error"
                    className="text-xs text-red-600 mt-1"
                    role="alert"
                  >
                    {errors.first_name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  value={authorData.last_name}
                  onChange={(e) => {
                    setAuthorData({ ...authorData, last_name: e.target.value });
                    if (errors.last_name)
                      setErrors({ ...errors, last_name: "" });
                  }}
                  onBlur={(e) => {
                    if (!e.target.value.trim()) {
                      setErrors({
                        ...errors,
                        last_name: "Last name is required",
                      });
                    }
                  }}
                  placeholder="Last Name"
                  style={{ borderColor: errors.last_name ? COLORS.errorBorder : COLORS.gray[300] }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.last_name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>
            <div>
                <input
                type="email"
                value={authorData.email}
                onChange={(e) => {
                  setAuthorData({ ...authorData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                onBlur={(e) => {
                  const email = e.target.value.trim();
                  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setErrors({
                      ...errors,
                      email: "Please enter a valid email",
                    });
                  }
                }}
                placeholder="Email"
                aria-label="Author email address"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                style={{ borderColor: errors.email ? COLORS.errorBorder : COLORS.gray[300] }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-xs text-red-600 mt-1"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={authorData.company}
                  onChange={(e) =>
                    setAuthorData({ ...authorData, company: e.target.value })
                  }
                  placeholder="Company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={authorData.job_title}
                  onChange={(e) =>
                    setAuthorData({ ...authorData, job_title: e.target.value })
                  }
                  placeholder="Job Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <textarea
                value={authorData.bio}
                onChange={(e) =>
                  setAuthorData({ ...authorData, bio: e.target.value })
                }
                placeholder="Bio (Optional)"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Post Text */}
          <div>
            <label
              htmlFor="text"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Post Text *
            </label>
            <textarea
              id="text"
              value={formData.text}
              onChange={(e) => {
                setFormData({ ...formData, text: e.target.value });
                if (errors.text) setErrors({ ...errors, text: "" });
              }}
              onBlur={(e) => {
                if (!e.target.value.trim()) {
                  setErrors({ ...errors, text: "Post text is required" });
                }
              }}
              rows={4}
              style={{ borderColor: errors.text ? COLORS.errorBorder : COLORS.gray[300] }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="What's on your mind?"
            />
            {errors.text && (
              <p className="text-xs text-red-600 mt-1">{errors.text}</p>
            )}
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Date *
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value || null })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="New York, USA"
            />
          </div>

          {/* Engagement Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="likes"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                👍 Likes
              </label>
              <input
                id="likes"
                type="number"
                min="0"
                value={formData.likes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    likes: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="comments"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                💬 Comments
              </label>
              <input
                id="comments"
                type="number"
                min="0"
                value={formData.comments}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    comments: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="shares"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                📊 Shares
              </label>
              <input
                id="shares"
                type="number"
                min="0"
                value={formData.shares}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shares: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTagToggle(tag.name);
                  }}
                  style={formData.tags.includes(tag.name) ? { backgroundColor: COLORS.primary } : undefined}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
                    formData.tags.includes(tag.name)
                      ? "text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image SVG */}
          <div>
            <label
              htmlFor="image_svg"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Image SVG (Optional)
            </label>
            <textarea
              id="image_svg"
              value={formData.image_svg || ""}
              onChange={(e) =>
                setFormData({ ...formData, image_svg: e.target.value || null })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-xs"
              placeholder="<svg>...</svg>"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              style={{ backgroundColor: COLORS.success }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = COLORS.successHover;
                }
              }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.success)}
              className="px-6 py-2 text-white rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : post ? "Save Changes" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
