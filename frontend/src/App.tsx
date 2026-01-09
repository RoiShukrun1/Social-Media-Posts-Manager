import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getPosts, createPost, updatePost, deletePost } from "./services/api";
import { Post, PostFilters, CreatePostData, UpdatePostData } from "./types";
import { getErrorMessage } from "./types/errors";
import { DEFAULTS } from "./constants/config";

import StatsHeader from "./components/StatsHeader";
import Filters from "./components/Filters";
import PostCard from "./components/PostCard";
import Pagination from "./components/Pagination";
import PostModal from "./components/PostModal";
import DeleteModal from "./components/DeleteModal";
import PostViewModal from "./components/PostViewModal";
import LoadingSkeleton from "./components/LoadingSkeleton";
import EmptyState from "./components/EmptyState";
import ToastProvider from "./components/ToastProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PostsManager() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<PostFilters>({
    order: "DESC",
    page: 1,
    limit: DEFAULTS.pageSize,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  // Fetch posts
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", filters],
    queryFn: () => getPosts(filters),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      // Close modal first for better UX
      setIsCreateModalOpen(false);
      // Show success toast
      toast.success("Post created successfully!");
      // Then invalidate and refetch both posts and stats
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["stats"] }),
      ]);
      // Force immediate refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["posts"] }),
        queryClient.refetchQueries({ queryKey: ["stats"] }),
      ]);
    },
    onError: (error: unknown) => {
      console.error("Create mutation failed:", error);
      const errorMessage = getErrorMessage(error);
      toast.error("Failed to create post: " + errorMessage);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostData }) =>
      updatePost(id, data),
    onSuccess: async () => {
      // Close modal first for better UX
      setEditingPost(null);
      // Show success toast
      toast.success("Post updated successfully!");
      // Then invalidate and refetch both posts and stats
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["stats"] }),
      ]);
      // Force immediate refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["posts"] }),
        queryClient.refetchQueries({ queryKey: ["stats"] }),
      ]);
    },
    onError: (error: unknown) => {
      console.error("Update mutation failed:", error);
      const errorMessage = getErrorMessage(error);
      toast.error("Failed to update post: " + errorMessage);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      // Close modal first for better UX
      setDeletingPost(null);
      // Show success toast
      toast.success("Post deleted successfully!");
      // Then invalidate and refetch both posts and stats
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["stats"] }),
      ]);
      // Force immediate refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["posts"] }),
        queryClient.refetchQueries({ queryKey: ["stats"] }),
      ]);
    },
    onError: (error: unknown) => {
      console.error("Delete mutation failed:", error);
      const errorMessage = getErrorMessage(error);
      toast.error("Failed to delete post: " + errorMessage);
    },
  });

  const handleFilterChange = (newFilters: PostFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreatePost = (data: CreatePostData | UpdatePostData) => {
    createMutation.mutate(data as CreatePostData);
  };

  const handleUpdatePost = (data: CreatePostData | UpdatePostData) => {
    if (editingPost) {
      updateMutation.mutate({
        id: editingPost.id,
        data: data as UpdatePostData,
      });
    }
  };

  const handleDeletePost = () => {
    if (deletingPost) {
      deleteMutation.mutate(deletingPost.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Stats Header */}
        <StatsHeader onAddPostClick={() => setIsCreateModalOpen(true)} />

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
                  onEdit={setEditingPost}
                  onDelete={setDeletingPost}
                  onView={setViewingPost}
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
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        post={editingPost}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDeletePost}
        post={deletingPost}
        isLoading={deleteMutation.isPending}
      />

      {/* View Post Modal */}
      {viewingPost && (
        <PostViewModal
          post={viewingPost}
          onClose={() => setViewingPost(null)}
        />
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
