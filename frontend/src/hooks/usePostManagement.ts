/**
 * usePostManagement.ts
 *
 * Custom hook for managing post CRUD operations.
 * Handles create, update, and delete mutations with proper cache invalidation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPost, updatePost, deletePost } from "../api";
import { CreatePostData, UpdatePostData } from "../types";
import { getErrorMessage } from "../types/errors";

export function usePostManagement() {
  const queryClient = useQueryClient();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      toast.success("Post created successfully!");
      // Invalidate queries (this automatically triggers refetch)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["stats"] }),
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
      toast.success("Post updated successfully!");
      // Invalidate queries (this automatically triggers refetch)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["stats"] }),
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
      toast.success("Post deleted successfully!");
      // Invalidate queries (this automatically triggers refetch)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["stats"] }),
      ]);
    },
    onError: (error: unknown) => {
      console.error("Delete mutation failed:", error);
      const errorMessage = getErrorMessage(error);
      toast.error("Failed to delete post: " + errorMessage);
    },
  });

  const handleCreate = (data: CreatePostData) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (id: number, data: UpdatePostData) => {
    updateMutation.mutate({ id, data });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    createPost: handleCreate,
    updatePost: handleUpdate,
    deletePost: handleDelete,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
