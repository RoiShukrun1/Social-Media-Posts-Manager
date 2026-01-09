/**
 * PostFormSection
 *
 * Form component for post content input fields.
 * Handles post text, category, date, location, engagement stats, and image SVG.
 */

import { CATEGORIES } from "../../constants/categories";
import { COLORS } from "../../constants/config";
import { CreatePostData } from "../../types";

interface PostFormSectionProps {
  formData: CreatePostData;
  errors: { text: string };
  onFormDataChange: (data: Partial<CreatePostData>) => void;
  onErrorChange: (errors: { text: string }) => void;
}

export default function PostFormSection({
  formData,
  errors,
  onFormDataChange,
  onErrorChange,
}: PostFormSectionProps) {
  return (
    <>
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
            onFormDataChange({ text: e.target.value });
            if (errors.text) onErrorChange({ text: "" });
          }}
          onBlur={(e) => {
            if (!e.target.value.trim()) {
              onErrorChange({ text: "Post text is required" });
            }
          }}
          rows={4}
          style={{
            borderColor: errors.text ? COLORS.errorBorder : COLORS.gray[300],
          }}
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
            onChange={(e) => onFormDataChange({ category: e.target.value })}
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
            onChange={(e) => onFormDataChange({ date: e.target.value })}
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
            onFormDataChange({ location: e.target.value || null })
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
              onFormDataChange({ likes: parseInt(e.target.value) || 0 })
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
              onFormDataChange({ comments: parseInt(e.target.value) || 0 })
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
              onFormDataChange({ shares: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
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
            onFormDataChange({ image_svg: e.target.value || null })
          }
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-xs"
          placeholder="<svg>...</svg>"
        />
      </div>
    </>
  );
}
