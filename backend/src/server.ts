import express, { Request, Response } from "express";
import cors from "cors";
import postsRouter from "./routes/posts";
import authorsRouter from "./routes/authors";
import tagsRouter from "./routes/tags";
import statsRouter from "./routes/stats";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: unknown) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

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
