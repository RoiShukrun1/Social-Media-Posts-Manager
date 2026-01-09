/**
 * App.tsx
 *
 * Main application component and entry point.
 * Orchestrates the post management system using custom hooks for separation of concerns.
 */

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { getPosts } from "./api";
import { CreatePostData, UpdatePostData } from "./types";

import StatsHeader from "./components/ui/StatsHeader";
import Filters from "./components/Filters";
import PostCard from "./components/ui/PostCard";
import Pagination from "./components/ui/Pagination";
import PostModal from "./components/modals/PostModal";
import DeleteModal from "./components/modals/DeleteModal";
import PostViewModal from "./components/modals/PostViewModal";
import LoadingSkeleton from "./components/ui/LoadingSkeleton";
import EmptyState from "./components/ui/EmptyState";
import ToastProvider from "./components/ui/ToastProvider";

import { usePostManagement } from "./hooks/usePostManagement";
import { useFilters } from "./hooks/useFilters";
import { useModals } from "./hooks/useModals";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PostsManager() {
  // Custom hooks for separation of concerns
  const { filters, handleFilterChange, handlePageChange } = useFilters();
  const {
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    editingPost,
    openEditModal,
    closeEditModal,
    deletingPost,
    openDeleteModal,
    closeDeleteModal,
    viewingPost,
    openViewModal,
    closeViewModal,
  } = useModals();
  const {
    createPost,
    updatePost,
    deletePost,
    isCreating,
    isUpdating,
    isDeleting,
  } = usePostManagement();

  // Fetch posts
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", filters],
    queryFn: () => getPosts(filters),
  });

  // Handler functions
  const handleCreatePost = (data: CreatePostData | UpdatePostData) => {
    createPost(data as CreatePostData);
    closeCreateModal();
  };

  const handleUpdatePost = (data: CreatePostData | UpdatePostData) => {
    if (editingPost) {
      updatePost(editingPost.id, data as UpdatePostData);
      closeEditModal();
    }
  };

  const handleDeletePost = () => {
    if (deletingPost) {
      deletePost(deletingPost.id);
      closeDeleteModal();
    }
  };

  const handleCloseEditModal = () => {
    closeCreateModal();
    closeEditModal();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Stats Header */}
        <StatsHeader onAddPostClick={openCreateModal} />

        {/* Filters */}
        <Filters filters={filters} onFiltersChange={handleFilterChange} />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-card p-4 mb-6">
            <p className="text-red-800 font-medium">Error loading posts</p>
            <p className="text-red-600 text-sm mt-1">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading && data && data.data.length === 0 && <EmptyState />}

        {/* Posts Grid */}
        {!isLoading && data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.data.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onView={openViewModal}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <Pagination
                pagination={data.pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <PostModal
        isOpen={isCreateModalOpen || !!editingPost}
        onClose={handleCloseEditModal}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        post={editingPost}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingPost}
        onClose={closeDeleteModal}
        onConfirm={handleDeletePost}
        post={deletingPost}
        isLoading={isDeleting}
      />

      {/* View Post Modal */}
      {viewingPost && (
        <PostViewModal post={viewingPost} onClose={closeViewModal} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider />
      <PostsManager />
    </QueryClientProvider>
  );
}
