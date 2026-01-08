import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, updatePost, deletePost } from './services/api';
import { Post, PostFilters, CreatePostData, UpdatePostData } from './types';

import StatsHeader from './components/StatsHeader';
import Filters from './components/Filters';
import PostCard from './components/PostCard';
import Pagination from './components/Pagination';
import PostModal from './components/PostModal';
import DeleteModal from './components/DeleteModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';

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
    sortBy: 'date',
    order: 'DESC',
    page: 1,
    limit: 20,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  // Listen for add post button click from header
  useEffect(() => {
    const handleOpenModal = () => setIsCreateModalOpen(true);
    window.addEventListener('openAddPostModal' as any, handleOpenModal);
    return () => window.removeEventListener('openAddPostModal' as any, handleOpenModal);
  }, []);

  // Fetch posts
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => getPosts(filters),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setIsCreateModalOpen(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostData }) =>
      updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setEditingPost(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setDeletingPost(null);
    },
  });

  const handleFilterChange = (newFilters: PostFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePost = (data: CreatePostData) => {
    createMutation.mutate(data);
  };

  const handleUpdatePost = (data: UpdatePostData) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    }
  };

  const handleDeletePost = () => {
    if (deletingPost) {
      deleteMutation.mutate(deletingPost.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Stats Header */}
      <StatsHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Add New Post Button - positioned in header */}

        {/* Filters */}
        <Filters filters={filters} onFiltersChange={handleFilterChange} />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-card p-4 mb-6">
            <p className="text-red-800 font-medium">Error loading posts</p>
            <p className="text-red-600 text-sm mt-1">
              {error instanceof Error ? error.message : 'An error occurred'}
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
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostsManager />
    </QueryClientProvider>
  );
}
