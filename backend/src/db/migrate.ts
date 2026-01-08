import { createTables, dropTables } from "./schema";
import { importDataFromCSV } from "../services/importService";

async function migrate() {
  console.log(
    "================================================================================"
  );
  console.log("DATABASE MIGRATION");
  console.log(
    "================================================================================\n"
  );

  try {
    // Drop existing tables and recreate
    console.log("[1/2] Creating database schema...");
    dropTables();
    createTables();

    // Import data from cleaned CSV
    console.log("\n[2/2] Importing data from CSV...");
    await importDataFromCSV();

    console.log(
      "\n================================================================================"
    );
    console.log("MIGRATION COMPLETE");
    console.log(
      "================================================================================"
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
