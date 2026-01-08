export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  job_title: string;
  bio: string;
  follower_count: number;
  verified: boolean;
}

export interface Post {
  id: number;
  author_id: number;
  text: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  image_svg?: string | null;
  category: string;
  location: string | null;
  engagement_rate: number;
  created_at: string;
  updated_at: string;
  author: Author;
  tags: string[];
}

export interface Tag {
  id: number;
  name: string;
  count?: number;
}

export interface Stats {
  totalPosts: number;
  totalAuthors: number;
  totalTags: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgEngagementRate: number;
  postsByCategory: Array<{ category: string; count: number }>;
  topAuthors: Array<{
    id: number;
    first_name: string;
    last_name: string;
    post_count: number;
    total_likes: number;
  }>;
  topTags: Array<{ name: string; count: number }>;
  recentPosts: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination: PaginationMeta;
}

export interface PostFilters {
  search?: string;
  category?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  minLikes?: number;
  minEngagement?: number;
  sortBy?: "date" | "likes" | "comments" | "shares" | "engagement_rate";
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export interface CreatePostData {
  author_id: number;
  text: string;
  date: string;
  likes?: number;
  comments?: number;
  shares?: number;
  image_svg?: string | null;
  category: string;
  location: string | null;
  engagement_rate?: number;
  tags: string[];
}

export type UpdatePostData = Partial<CreatePostData>;

export interface CreateAuthorData {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  job_title?: string;
  bio?: string;
  follower_count?: number;
  verified?: boolean;
}
