/**
 * config.ts
 *
 * Application configuration management.
 * Centralizes all environment variables and configuration settings with sensible defaults.
 * Provides type-safe access to configuration across the application.
 */

import path from "path";

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    path: process.env.DB_PATH || path.join(__dirname, "../data/posts.db"),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
  csv: {
    path:
      process.env.CSV_PATH ||
      path.join(__dirname, "../../data/social_media_posts_data_clean.csv"),
  },
};
