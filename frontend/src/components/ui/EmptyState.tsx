/**
 * EmptyState
 * 
 * Component displayed when no posts match the current filters.
 * Provides user feedback and encourages action.
 */

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = 'No posts match your filters' }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-card shadow-card p-12 text-center">
      <div className="text-6xl mb-4">📭</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Posts Found</h3>
      <p className="text-gray-600">{message}</p>
      <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search terms</p>
    </div>
  );
}
