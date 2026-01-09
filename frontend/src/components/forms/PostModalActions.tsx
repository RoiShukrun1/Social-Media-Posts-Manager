/**
 * PostModalActions
 * 
 * Action buttons component for PostModal (Cancel and Submit/Save).
 * Handles loading states and form validation display.
 */

import { COLORS } from "../../constants/config";

interface PostModalActionsProps {
  isLoading: boolean;
  isFormValid: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

export default function PostModalActions({
  isLoading,
  isFormValid,
  isEditMode,
  onCancel,
}: PostModalActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        style={{ backgroundColor: COLORS.success }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = COLORS.successHover;
          }
        }}
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = COLORS.success)
        }
        className="px-6 py-2 text-white rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Post"}
      </button>
    </div>
  );
}
