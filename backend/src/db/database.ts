/**
 * database.ts
 *
 * Database connection and configuration.
 * Initializes SQLite database using better-sqlite3 with foreign key constraints enabled.
 * Exports the database instance for use throughout the application.
 */

import Database from "better-sqlite3";
import { config } from "../config";

const dbPath = config.database.path;
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Graceful shutdown handlers
const shutdown = () => {
  console.log("Closing database connection...");
  db.close();
  console.log("Database connection closed.");
  process.exit(0);
};

// Handle Ctrl+C
process.on("SIGINT", shutdown);

// Handle process termination
process.on("SIGTERM", shutdown);

export default db;
