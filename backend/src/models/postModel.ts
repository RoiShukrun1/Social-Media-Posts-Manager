/**
 * postModel.ts
 *
 * Post data access layer with advanced query capabilities.
 * Provides methods for CRUD operations with filtering, sorting, and pagination.
 * Optimized to avoid N+1 query problems by batching tag queries.
 */

import db from "../db/database";
import type { Post, PostWithAuthorAndTags, Author, Tag } from "../types";

export interface PostFilters {
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PostSort {
  field: "date" | "likes" | "comments" | "shares" | "engagement_rate";
  order: "ASC" | "DESC";
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Database row type for posts with author data
interface PostWithAuthorRow {
  id: number;
  author_id: number;
  text: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  image_svg: string | null;
  category: string;
  location: string | null;
  engagement_rate: number;
  created_at: string;
  updated_at: string;
  author_first_name: string;
  author_last_name: string;
  author_email: string;
  author_company: string;
  author_job_title: string;
  author_bio: string;
  author_follower_count: number;
  author_verified: number; // SQLite stores boolean as 0/1
}

// Safe mapping for sort fields to prevent SQL injection
const SORT_FIELD_MAP = {
  date: "p.date",
  likes: "p.likes",
  comments: "p.comments",
  shares: "p.shares",
  engagement_rate: "p.engagement_rate",
} as const;

export class PostModel {
  static getAllPosts(
    filters: PostFilters = {},
    sort: PostSort = { field: "date", order: "DESC" },
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): { posts: PostWithAuthorAndTags[]; total: number } {
    let whereConditions: string[] = [];
    let params: (string | number)[] = [];

    // Build WHERE clause
    if (filters.category) {
      whereConditions.push("p.category = ?");
      params.push(filters.category);
    }

    if (filters.search) {
      whereConditions.push(
        "(p.text LIKE ? OR a.first_name LIKE ? OR a.last_name LIKE ?)"
      );
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (filters.dateFrom) {
      whereConditions.push("p.date >= ?");
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      whereConditions.push("p.date <= ?");
      params.push(filters.dateTo);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as count
      FROM posts p
      JOIN authors a ON p.author_id = a.id
      ${whereClause}
    `;
    const countResult = db.prepare(countQuery).get(...params) as {
      count: number;
    };
    const total = countResult.count;

    // Get paginated results
    const offset = (pagination.page - 1) * pagination.limit;

    // Use safe mapping for sort field and validate sort order
    const sortColumn = SORT_FIELD_MAP[sort.field] || SORT_FIELD_MAP.date;
    const sortOrder = sort.order === "ASC" ? "ASC" : "DESC";

    const query = `
      SELECT 
        p.*,
        a.id as author_id,
        a.first_name as author_first_name,
        a.last_name as author_last_name,
        a.email as author_email,
        a.company as author_company,
        a.job_title as author_job_title,
        a.bio as author_bio,
        a.follower_count as author_follower_count,
        a.verified as author_verified
      FROM posts p
      JOIN authors a ON p.author_id = a.id
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const rows = db
      .prepare(query)
      .all(...params, pagination.limit, offset) as PostWithAuthorRow[];

    // If no posts, return early
    if (rows.length === 0) {
      return { posts: [], total };
    }

    // Fetch all tags for all posts in a single query
    const postIds = rows.map((row) => row.id);
    const tagsQuery = `
      SELECT pt.post_id, t.name
      FROM post_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.post_id IN (${postIds.map(() => "?").join(",")})
      ORDER BY t.name
    `;

    const tagRows = db.prepare(tagsQuery).all(...postIds) as Array<{
      post_id: number;
      name: string;
    }>;

    // Group tags by post_id for O(1) lookup
    const tagsByPost = new Map<number, string[]>();
    for (const tag of tagRows) {
      if (!tagsByPost.has(tag.post_id)) {
        tagsByPost.set(tag.post_id, []);
      }
      tagsByPost.get(tag.post_id)!.push(tag.name);
    }

    // Transform rows with efficient tag lookup
    const posts: PostWithAuthorAndTags[] = rows.map((row) => {
      return {
        id: row.id,
        author_id: row.author_id,
        text: row.text,
        date: row.date,
        likes: row.likes,
        comments: row.comments,
        shares: row.shares,
        image_svg: row.image_svg,
        category: row.category,
        location: row.location,
        engagement_rate: row.engagement_rate,
        created_at: row.created_at,
        updated_at: row.updated_at,
        author: {
          id: row.author_id,
          first_name: row.author_first_name,
          last_name: row.author_last_name,
          email: row.author_email,
          company: row.author_company,
          job_title: row.author_job_title,
          bio: row.author_bio,
          follower_count: row.author_follower_count,
          verified: Boolean(row.author_verified),
        },
        tags: tagsByPost.get(row.id) || [],
      };
    });

    return { posts, total };
  }

  static getPostById(id: number): PostWithAuthorAndTags | null {
    const query = `
      SELECT 
        p.*,
        a.id as author_id,
        a.first_name as author_first_name,
        a.last_name as author_last_name,
        a.email as author_email,
        a.company as author_company,
        a.job_title as author_job_title,
        a.bio as author_bio,
        a.follower_count as author_follower_count,
        a.verified as author_verified
      FROM posts p
      JOIN authors a ON p.author_id = a.id
      WHERE p.id = ?
    `;

    const row = db.prepare(query).get(id) as PostWithAuthorRow | undefined;
    if (!row) return null;

    const tags = this.getPostTags(row.id);

    return {
      id: row.id,
      author_id: row.author_id,
      text: row.text,
      date: row.date,
      likes: row.likes,
      comments: row.comments,
      shares: row.shares,
      image_svg: row.image_svg,
      category: row.category,
      location: row.location,
      engagement_rate: row.engagement_rate,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author: {
        id: row.author_id,
        first_name: row.author_first_name,
        last_name: row.author_last_name,
        email: row.author_email,
        company: row.author_company,
        job_title: row.author_job_title,
        bio: row.author_bio,
        follower_count: row.author_follower_count,
        verified: Boolean(row.author_verified),
      },
      tags,
    };
  }

  static getPostTags(postId: number): string[] {
    const query = `
      SELECT t.name
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
      ORDER BY t.name
    `;
    const rows = db.prepare(query).all(postId) as { name: string }[];
    return rows.map((row) => row.name);
  }

  static createPost(
    post: Omit<Post, "id" | "created_at" | "updated_at">,
    tags: string[]
  ): number {
    const insertPost = db.prepare(`
      INSERT INTO posts (author_id, text, date, likes, comments, shares, image_svg, category, location, engagement_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertPost.run(
      post.author_id,
      post.text,
      post.date,
      post.likes,
      post.comments,
      post.shares,
      post.image_svg || null,
      post.category,
      post.location,
      post.engagement_rate
    );

    const postId = result.lastInsertRowid as number;

    // Add tags
    if (tags.length > 0) {
      this.updatePostTags(postId, tags);
    }

    return postId;
  }

  static updatePost(
    id: number,
    post: Partial<Omit<Post, "id" | "created_at" | "updated_at">>,
    tags?: string[]
  ): boolean {
    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    // Build dynamic UPDATE clause
    if (post.text !== undefined) {
      updates.push("text = ?");
      params.push(post.text);
    }
    if (post.date !== undefined) {
      updates.push("date = ?");
      params.push(post.date);
    }
    if (post.likes !== undefined) {
      updates.push("likes = ?");
      params.push(post.likes);
    }
    if (post.comments !== undefined) {
      updates.push("comments = ?");
      params.push(post.comments);
    }
    if (post.shares !== undefined) {
      updates.push("shares = ?");
      params.push(post.shares);
    }
    if (post.image_svg !== undefined) {
      updates.push("image_svg = ?");
      params.push(post.image_svg || null);
    }
    if (post.category !== undefined) {
      updates.push("category = ?");
      params.push(post.category);
    }
    if (post.location !== undefined) {
      updates.push("location = ?");
      params.push(post.location || null);
    }
    if (post.engagement_rate !== undefined) {
      updates.push("engagement_rate = ?");
      params.push(post.engagement_rate);
    }
    if (post.author_id !== undefined) {
      updates.push("author_id = ?");
      params.push(post.author_id);
    }

    // Always update the updated_at timestamp
    updates.push("updated_at = CURRENT_TIMESTAMP");

    if (updates.length === 1) {
      // Only updated_at, nothing to update
      return false;
    }

    params.push(id); // Add id for WHERE clause

    const updateQuery = `
      UPDATE posts
      SET ${updates.join(", ")}
      WHERE id = ?
    `;

    const result = db.prepare(updateQuery).run(...params);

    // Update tags if provided
    if (tags !== undefined) {
      this.updatePostTags(id, tags);
    }

    return result.changes > 0;
  }

  static deletePost(id: number): boolean {
    const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static updatePostTags(postId: number, tags: string[]): void {
    // Remove existing tags
    db.prepare("DELETE FROM post_tags WHERE post_id = ?").run(postId);

    if (tags.length === 0) return;

    // Get or create tags and link them
    const insertTag = db.prepare(
      "INSERT OR IGNORE INTO tags (name) VALUES (?)"
    );
    const getTag = db.prepare("SELECT id FROM tags WHERE name = ?");
    const insertPostTag = db.prepare(
      "INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)"
    );

    for (const tagName of tags) {
      insertTag.run(tagName);
      const tag = getTag.get(tagName) as Tag;
      insertPostTag.run(postId, tag.id);
    }
  }
}
