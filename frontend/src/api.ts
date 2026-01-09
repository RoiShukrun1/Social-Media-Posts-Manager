/**
 * api.ts
 *
 * API service layer for all backend communication.
 * Handles HTTP requests for posts, authors, tags, and statistics.
 * Uses axios for HTTP client with centralized configuration.
 */

import axios from "axios";
import type {
  Post,
  PostsResponse,
  PostFilters,
  CreatePostData,
  UpdatePostData,
  Author,
  CreateAuthorData,
  Tag,
  Stats,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Posts
export const getPosts = async (
  filters: PostFilters = {}
): Promise<PostsResponse> => {
  const response = await api.get("/posts", { params: filters });
  return response.data;
};

export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await api.post("/posts", data);
  return response.data.data;
};

export const updatePost = async (
  id: number,
  data: UpdatePostData
): Promise<Post> => {
  const response = await api.put(`/posts/${id}`, data);
  return response.data.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

// Authors
export const createAuthor = async (data: CreateAuthorData): Promise<Author> => {
  const response = await api.post("/authors", data);
  return response.data.data;
};

export const updateAuthor = async (
  id: number,
  data: Partial<CreateAuthorData>
): Promise<Author> => {
  const response = await api.put(`/authors/${id}`, data);
  return response.data.data;
};

// Tags
export const getTags = async (): Promise<Tag[]> => {
  const response = await api.get("/tags");
  return response.data.data;
};

// Stats
export const getStats = async (): Promise<Stats> => {
  const response = await api.get("/stats");
  return response.data.data;
};

export default api;
