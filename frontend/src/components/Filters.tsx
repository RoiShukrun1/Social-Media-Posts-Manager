import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTags } from "../services/api";
import { PostFilters } from "../types";

interface FiltersProps {
  filters: PostFilters;
  onFiltersChange: (filters: PostFilters) => void;
}

const CATEGORIES = [
  "Technology",
  "Business",
  "Entertainment",
  "Health",
  "Sports",
  "Travel",
  "Food",
  "Fashion",
  "Education",
  "Science",
];

const SORT_OPTIONS = ["date", "likes", "comments", "shares", "engagement_rate"];

interface ValidationErrors {
  category?: string;
  sortBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function Filters({ filters, onFiltersChange }: FiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [localCategory, setLocalCategory] = useState(filters.category || "");
  const [localDateFrom, setLocalDateFrom] = useState(filters.dateFrom || "");
  const [localDateTo, setLocalDateTo] = useState(filters.dateTo || "");
  const [localSortBy, setLocalSortBy] = useState<string>(filters.sortBy || "");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const isFirstRender = useRef(true);

  useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(true),
  });

  // Debounce search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: localSearch || undefined,
        page: 1,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return true; // Empty is valid

    // Check format dd/mm/yyyy
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(dateRegex);

    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;

    // Check if date is valid
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const convertToAPIFormat = (dateStr: string): string => {
    // Convert dd/mm/yyyy to yyyy-mm-dd
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleApplyFilters = () => {
    const newErrors: ValidationErrors = {};

    // Validate category
    if (localCategory && !CATEGORIES.includes(localCategory)) {
      newErrors.category = `Invalid category. Valid options: ${CATEGORIES.join(
        ", "
      )}`;
    }

    // Validate sort
    if (localSortBy && !SORT_OPTIONS.includes(localSortBy)) {
      newErrors.sortBy = `Invalid sort option. Valid options: ${SORT_OPTIONS.join(
        ", "
      )}`;
    }

    // Validate dates
    if (localDateFrom && !validateDate(localDateFrom)) {
      newErrors.dateFrom = "Invalid date format. Please use dd/mm/yyyy";
    }

    if (localDateTo && !validateDate(localDateTo)) {
      newErrors.dateTo = "Invalid date format. Please use dd/mm/yyyy";
    }

    setErrors(newErrors);

    // If there are errors, don't apply filters
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Apply filters
    onFiltersChange({
      ...filters,
      search: localSearch || undefined,
      category: localCategory || undefined,
      dateFrom: localDateFrom ? convertToAPIFormat(localDateFrom) : undefined,
      dateTo: localDateTo ? convertToAPIFormat(localDateTo) : undefined,
      sortBy: (localSortBy || "date") as PostFilters["sortBy"],
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setLocalSearch("");
    setLocalCategory("");
    setLocalDateFrom("");
    setLocalDateTo("");
    setLocalSortBy("");
    setErrors({});
    onFiltersChange({
      sortBy: "date",
      order: "DESC",
      page: 1,
      limit: 20,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            value={localCategory}
            onChange={(e) => {
              setLocalCategory(e.target.value);
              if (errors.category) {
                setErrors({ ...errors, category: undefined });
              }
            }}
            placeholder="e.g., Technology"
            className={`w-full px-4 py-2 border ${
              errors.category ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 ${
              errors.category ? "focus:ring-red-500" : "focus:ring-blue-500"
            } focus:border-transparent`}
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Date From */}
        <div>
          <label
            htmlFor="dateFrom"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Date From
          </label>
          <input
            id="dateFrom"
            type="text"
            value={localDateFrom}
            onChange={(e) => {
              setLocalDateFrom(e.target.value);
              if (errors.dateFrom) {
                setErrors({ ...errors, dateFrom: undefined });
              }
            }}
            placeholder="dd/mm/yyyy"
            className={`w-full px-4 py-2 border ${
              errors.dateFrom ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 ${
              errors.dateFrom ? "focus:ring-red-500" : "focus:ring-blue-500"
            } focus:border-transparent`}
          />
          {errors.dateFrom && (
            <p className="mt-1 text-xs text-red-600">{errors.dateFrom}</p>
          )}
        </div>

        {/* Date To */}
        <div>
          <label
            htmlFor="dateTo"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Date To
          </label>
          <input
            id="dateTo"
            type="text"
            value={localDateTo}
            onChange={(e) => {
              setLocalDateTo(e.target.value);
              if (errors.dateTo) {
                setErrors({ ...errors, dateTo: undefined });
              }
            }}
            placeholder="dd/mm/yyyy"
            className={`w-full px-4 py-2 border ${
              errors.dateTo ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 ${
              errors.dateTo ? "focus:ring-red-500" : "focus:ring-blue-500"
            } focus:border-transparent`}
          />
          {errors.dateTo && (
            <p className="mt-1 text-xs text-red-600">{errors.dateTo}</p>
          )}
        </div>

        {/* Sort By */}
        <div>
          <label
            htmlFor="sortBy"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Sort By
          </label>
          <input
            id="sortBy"
            type="text"
            value={localSortBy}
            onChange={(e) => {
              setLocalSortBy(e.target.value);
              if (errors.sortBy) {
                setErrors({ ...errors, sortBy: undefined });
              }
            }}
            placeholder="e.g., date"
            className={`w-full px-4 py-2 border ${
              errors.sortBy ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 ${
              errors.sortBy ? "focus:ring-red-500" : "focus:ring-blue-500"
            } focus:border-transparent`}
          />
          {errors.sortBy && (
            <p className="mt-1 text-xs text-red-600">{errors.sortBy}</p>
          )}
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-[#4299E1] text-white rounded-lg font-semibold hover:bg-[#3182CE] transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
