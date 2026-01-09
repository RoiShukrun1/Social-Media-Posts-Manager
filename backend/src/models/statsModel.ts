/**
 * statsModel.ts
 *
 * Statistics data access layer.
 * Provides aggregated statistics for the dashboard including total posts, likes, comments, and engagement rates.
 * Uses optimized queries to calculate metrics across all posts.
 */

import db from '../db/database';

export interface Stats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  avgEngagementRate: number;
}

export class StatsModel {
  static getStats(): Stats {
    // Get all stats in a single optimized query
    const result = db.prepare(`
      SELECT 
        COUNT(*) as totalPosts,
        COALESCE(SUM(likes), 0) as totalLikes,
        COALESCE(SUM(comments), 0) as totalComments,
        COALESCE(AVG(engagement_rate), 0) as avgEngagementRate
      FROM posts
    `).get() as Stats;

    return result;
  }
}

