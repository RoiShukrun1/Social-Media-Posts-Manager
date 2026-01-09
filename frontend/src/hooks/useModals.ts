/**
 * useModals.ts
 *
 * Custom hook for managing modal state.
 * Handles opening/closing of create, edit, delete, and view modals.
 */

import { useState } from "react";
import { Post } from "../types";

export function useModals() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (post: Post) => setEditingPost(post);
  const closeEditModal = () => setEditingPost(null);

  const openDeleteModal = (post: Post) => setDeletingPost(post);
  const closeDeleteModal = () => setDeletingPost(null);

  const openViewModal = (post: Post) => setViewingPost(post);
  const closeViewModal = () => setViewingPost(null);

  const closeAllModals = () => {
    setIsCreateModalOpen(false);
    setEditingPost(null);
    setDeletingPost(null);
    setViewingPost(null);
  };

  return {
    // Create modal
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    // Edit modal
    editingPost,
    openEditModal,
    closeEditModal,
    // Delete modal
    deletingPost,
    openDeleteModal,
    closeDeleteModal,
    // View modal
    viewingPost,
    openViewModal,
    closeViewModal,
    // Utility
    closeAllModals,
  };
}
