/**
 * useFilters.ts
 *
 * Custom hook for managing post filter state.
 * Handles filter changes and pagination with proper state management.
 */

import { useState, useCallback } from "react";
import { PostFilters } from "../types";
import { DEFAULTS } from "../constants/config";

export function useFilters() {
  const [filters, setFilters] = useState<PostFilters>({
    order: "DESC",
    page: 1,
    limit: DEFAULTS.pageSize,
  });

  const handleFilterChange = useCallback((newFilters: PostFilters) => {
    setFilters({ ...newFilters, page: 1 });
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    filters,
    handleFilterChange,
    handlePageChange,
  };
}
