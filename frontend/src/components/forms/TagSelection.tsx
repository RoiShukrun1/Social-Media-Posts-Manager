/**
 * TagSelection
 * 
 * Component for selecting and managing post tags.
 * Displays available tags as toggleable buttons.
 */

import { COLORS } from "../../constants/config";
import { Tag } from "../../types";

interface TagSelectionProps {
  availableTags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagName: string) => void;
}

export default function TagSelection({
  availableTags,
  selectedTags,
  onTagToggle,
}: TagSelectionProps) {
  return (
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
              onTagToggle(tag.name);
            }}
            style={
              selectedTags.includes(tag.name)
                ? { backgroundColor: COLORS.primary }
                : undefined
            }
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedTags.includes(tag.name)
                ? "text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
