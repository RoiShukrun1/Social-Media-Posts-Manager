/**
 * PostModal
 *
 * Modal component for creating new posts or editing existing ones.
 * Handles form validation, author management, and post submission.
 * Composed of sub-components: AuthorFormSection, PostFormSection, TagSelection, and PostModalActions.
 */

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getTags, createAuthor, updateAuthor } from "../../services/api";
import { Post, CreatePostData, UpdatePostData } from "../../types";
import { DEFAULTS } from "../../constants/config";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { getErrorMessage } from "../../types/errors";
import AuthorFormSection from "../forms/AuthorFormSection";
import PostFormSection from "../forms/PostFormSection";
import TagSelection from "../forms/TagSelection";
import PostModalActions from "../forms/PostModalActions";

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

  // Initialize form data when modal opens or post changes
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
        toast.error(getErrorMessage(error));
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
          toast.error(getErrorMessage(error));
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

  const handleAuthorDataChange = (data: Partial<typeof authorData>) => {
    setAuthorData((prev) => ({ ...prev, ...data }));
  };

  const handleFormDataChange = (data: Partial<CreatePostData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleErrorChange = (newErrors: Partial<typeof errors>) => {
    setErrors((prev) => ({ ...prev, ...newErrors }));
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
          <AuthorFormSection
            authorData={authorData}
            errors={{
              first_name: errors.first_name,
              last_name: errors.last_name,
              email: errors.email,
            }}
            onAuthorDataChange={handleAuthorDataChange}
            onErrorChange={handleErrorChange}
            firstInputRef={firstInputRef}
          />

          <PostFormSection
            formData={formData}
            errors={{ text: errors.text }}
            onFormDataChange={handleFormDataChange}
            onErrorChange={handleErrorChange}
          />

          <TagSelection
            availableTags={availableTags}
            selectedTags={formData.tags}
            onTagToggle={handleTagToggle}
          />

          <PostModalActions
            isLoading={isLoading || false}
            isFormValid={isFormValid()}
            isEditMode={!!post}
            onCancel={onClose}
          />
        </form>
      </div>
    </div>
  );
}
