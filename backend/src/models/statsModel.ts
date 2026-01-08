import db from '../db/database';

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

export class StatsModel {
  static getStats(): Stats {
    // Total posts
    const totalPostsResult = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
    const totalPosts = totalPostsResult.count;

    // Total authors
    const totalAuthorsResult = db.prepare('SELECT COUNT(*) as count FROM authors').get() as { count: number };
    const totalAuthors = totalAuthorsResult.count;

    // Total tags
    const totalTagsResult = db.prepare('SELECT COUNT(*) as count FROM tags').get() as { count: number };
    const totalTags = totalTagsResult.count;

    // Total engagement
    const engagementResult = db.prepare(`
      SELECT 
        COALESCE(SUM(likes), 0) as totalLikes,
        COALESCE(SUM(comments), 0) as totalComments,
        COALESCE(SUM(shares), 0) as totalShares,
        COALESCE(AVG(engagement_rate), 0) as avgEngagementRate
      FROM posts
    `).get() as {
      totalLikes: number;
      totalComments: number;
      totalShares: number;
      avgEngagementRate: number;
    };

    // Posts by category
    const postsByCategory = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM posts
      GROUP BY category
      ORDER BY count DESC
    `).all() as Array<{ category: string; count: number }>;

    // Top authors
    const topAuthors = db.prepare(`
      SELECT 
        a.id,
        a.first_name,
        a.last_name,
        COUNT(p.id) as post_count,
        SUM(p.likes) as total_likes
      FROM authors a
      JOIN posts p ON a.id = p.author_id
      GROUP BY a.id
      ORDER BY post_count DESC, total_likes DESC
      LIMIT 10
    `).all() as Array<{
      id: number;
      first_name: string;
      last_name: string;
      post_count: number;
      total_likes: number;
    }>;

    // Top tags
    const topTags = db.prepare(`
      SELECT t.name, COUNT(pt.post_id) as count
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      GROUP BY t.id
      ORDER BY count DESC
      LIMIT 10
    `).all() as Array<{ name: string; count: number }>;

    // Recent posts (last 7 days)
    const recentPostsResult = db.prepare(`
      SELECT COUNT(*) as count
      FROM posts
      WHERE date >= datetime('now', '-7 days')
    `).get() as { count: number };

    return {
      totalPosts,
      totalAuthors,
      totalTags,
      totalLikes: engagementResult.totalLikes,
      totalComments: engagementResult.totalComments,
      totalShares: engagementResult.totalShares,
      avgEngagementRate: engagementResult.avgEngagementRate,
      postsByCategory,
      topAuthors,
      topTags,
      recentPosts: recentPostsResult.count,
    };
  }
}

