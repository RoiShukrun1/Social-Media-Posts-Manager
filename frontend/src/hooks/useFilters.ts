/**
 * useFilters.ts
 *
 * Custom hook for managing post filter state.
 * Handles filter changes and pagination with proper state management.
 * Syncs filters with URL query parameters for persistence across refreshes.
 */

import { useState, useCallback, useEffect } from "react";
import { PostFilters } from "../types";
import { DEFAULTS } from "../constants/config";

// Helper function to read filters from URL (outside component to prevent recreation)
const getFiltersFromURL = (): PostFilters => {
  const params = new URLSearchParams(window.location.search);
  const pageFromURL = parseInt(params.get("page") || "1");

  return {
    search: params.get("search") || undefined,
    category: params.get("category") || undefined,
    dateFrom: params.get("dateFrom") || undefined,
    dateTo: params.get("dateTo") || undefined,
    sortBy: (params.get("sortBy") as PostFilters["sortBy"]) || "date",
    order: (params.get("order") as "ASC" | "DESC") || "DESC",
    page: pageFromURL,
    limit: parseInt(params.get("limit") || String(DEFAULTS.pageSize)),
  };
};

export function useFilters() {
  // Initialize filters from URL on mount
  const [filters, setFilters] = useState<PostFilters>(() =>
    getFiltersFromURL()
  );

  // Sync filters to URL whenever they change
  useEffect(() => {
    const params = new URLSearchParams();

    // Only add filters that are non-default or non-empty
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);

    // Only add sortBy if it's not the default "date"
    if (filters.sortBy && filters.sortBy !== "date") {
      params.set("sortBy", filters.sortBy);
    }

    // Only add order if it's not the default "DESC"
    if (filters.order && filters.order !== "DESC") {
      params.set("order", filters.order);
    }

    // Only add page if it's not page 1
    if (filters.page && filters.page !== 1) {
      params.set("page", String(filters.page));
    }

    // Only add limit if it's not the default page size
    if (filters.limit && filters.limit !== DEFAULTS.pageSize) {
      params.set("limit", String(filters.limit));
    }

    // Update URL (or clear it if no params)
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [filters]);

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
