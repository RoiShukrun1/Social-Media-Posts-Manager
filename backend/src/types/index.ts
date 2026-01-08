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
  image_svg?: string;
  category: string;
  location: string;
  engagement_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostTag {
  post_id: number;
  tag_id: number;
}

export interface PostWithAuthorAndTags extends Post {
  author: Author;
  tags: string[];
}

export interface CSVRow {
  post_id: string;
  author_first_name: string;
  author_last_name: string;
  author_email: string;
  author_company: string;
  author_job_title: string;
  author_bio: string;
  author_follower_count: string;
  author_verified: string;
  post_text: string;
  post_date: string;
  likes: string;
  comments: string;
  shares: string;
  total_engagements: string;
  engagement_rate: string;
  post_image_svg: string;
  post_category: string;
  post_tags: string;
  location: string;
}
