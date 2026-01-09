/**
 * server.ts
 *
 * Main server application and entry point.
 * Initializes Express server, sets up middleware, configures routes, and handles database initialization.
 * Provides RESTful API endpoints for posts, authors, tags, and statistics.
 */

import express, { Request, Response } from "express";
import cors from "cors";
import postsRouter from "./routes/posts";
import authorsRouter from "./routes/authors";
import tagsRouter from "./routes/tags";
import statsRouter from "./routes/stats";
import { HTTP_STATUS } from "./constants";
import { createTables } from "./db/schema";
import { importDataFromCSV } from "./db/import";
import db from "./db/database";
import { config } from "./config";

const app = express();
const PORT = config.port;

// Initialize database on startup
const initDB = async () => {
  try {
    // Check if tables exist
    const tableCheck = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='posts'"
      )
      .get();

    if (!tableCheck) {
      console.log("Initializing database...");
      createTables();
      console.log("✓ Database schema created");

      // Check if database is empty and import data
      const postCount = db
        .prepare("SELECT COUNT(*) as count FROM posts")
        .get() as { count: number };

      if (postCount.count === 0) {
        console.log("Database is empty. Importing data from CSV...");
        await importDataFromCSV();
        console.log("✓ Data import completed");
      }

      console.log("✓ Database initialized");
    } else {
      console.log("✓ Database already initialized");
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

// Middleware
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/posts", postsRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/stats", statsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: unknown) => {
  console.error("Error:", err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: "Internal server error",
  });
});

// Start server after database initialization
const startServer = async () => {
  await initDB();

  app.listen(PORT, () => {
    console.log(
      "================================================================================"
    );
    console.log("SOCIAL MEDIA POSTS MANAGEMENT SYSTEM - BACKEND API");
    console.log(
      "================================================================================"
    );
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log("\nAvailable endpoints:");
    console.log(
      "  GET    /api/posts          - List posts (with filters, sorting, pagination)"
    );
    console.log("  POST   /api/posts          - Create new post");
    console.log("  PUT    /api/posts/:id      - Update post");
    console.log("  DELETE /api/posts/:id      - Delete post");
    console.log("  POST   /api/authors        - Create new author");
    console.log("  PUT    /api/authors/:id    - Update author");
    console.log("  GET    /api/tags           - List all tags");
    console.log("  GET    /api/stats          - Get dashboard statistics");
    console.log(
      "================================================================================"
    );
  });
};

startServer();
