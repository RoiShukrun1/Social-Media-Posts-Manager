import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import db from "../db/database";
import type { CSVRow, Author, Tag } from "../types";
import { hasErrorCode } from "../utils/errorHandler";

export async function importDataFromCSV() {
  const csvPath = path.join(
    __dirname,
    "../../../data/social_media_posts_data_clean.csv"
  );

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const records: CSVRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`  ✓ Loaded ${records.length} rows from CSV`);

  // Use a transaction for better performance
  const importData = db.transaction(() => {
    const authorCache = new Map<string, number>();
    const tagCache = new Map<string, number>();

    // Prepared statements for better performance
    const insertAuthor = db.prepare(`
      INSERT INTO authors (first_name, last_name, email, company, job_title, bio, follower_count, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertPost = db.prepare(`
      INSERT INTO posts (id, author_id, text, date, likes, comments, shares, image_svg, category, location, engagement_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTag = db.prepare(`
      INSERT INTO tags (name) VALUES (?)
    `);

    const insertPostTag = db.prepare(`
      INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)
    `);

    let authorsCreated = 0;
    let postsCreated = 0;
    let tagsCreated = 0;
    let postTagsCreated = 0;

    for (const row of records) {
      // Get or create author
      let authorId = authorCache.get(row.author_email);

      if (!authorId) {
        const result = insertAuthor.run(
          row.author_first_name,
          row.author_last_name,
          row.author_email,
          row.author_company,
          row.author_job_title,
          row.author_bio,
          parseInt(row.author_follower_count),
          row.author_verified.toLowerCase() === "true" ? 1 : 0
        );
        authorId = result.lastInsertRowid as number;
        authorCache.set(row.author_email, authorId);
        authorsCreated++;
      }

      // Insert post
      const postId = parseInt(row.post_id);
      insertPost.run(
        postId,
        authorId,
        row.post_text,
        row.post_date,
        parseInt(row.likes),
        parseInt(row.comments),
        parseInt(row.shares),
        row.post_image_svg || null,
        row.post_category,
        row.location || null,
        parseFloat(row.engagement_rate)
      );
      postsCreated++;

      // Parse and insert tags
      if (row.post_tags && row.post_tags.trim() !== "") {
        try {
          const tags: string[] = JSON.parse(row.post_tags);

          for (const tagName of tags) {
            let tagId = tagCache.get(tagName);

            if (!tagId) {
              try {
                const result = insertTag.run(tagName);
                tagId = result.lastInsertRowid as number;
                tagCache.set(tagName, tagId);
                tagsCreated++;
              } catch (err) {
                // Tag might already exist due to unique constraint
                if (
                  hasErrorCode(err) &&
                  err.code === "SQLITE_CONSTRAINT_UNIQUE"
                ) {
                  const existingTag = db
                    .prepare("SELECT id FROM tags WHERE name = ?")
                    .get(tagName) as Tag;
                  tagId = existingTag.id;
                  tagCache.set(tagName, tagId);
                } else {
                  throw err;
                }
              }
            }

            // Link post to tag
            try {
              insertPostTag.run(postId, tagId);
              postTagsCreated++;
            } catch (err) {
              // Ignore duplicate post-tag relationships
              if (
                !hasErrorCode(err) ||
                err.code !== "SQLITE_CONSTRAINT_PRIMARYKEY"
              ) {
                throw err;
              }
            }
          }
        } catch (parseError) {
          console.warn(
            `  ⚠ Failed to parse tags for post ${postId}:`,
            row.post_tags
          );
        }
      }
    }

    console.log(`  ✓ Created ${authorsCreated} authors`);
    console.log(`  ✓ Created ${postsCreated} posts`);
    console.log(`  ✓ Created ${tagsCreated} tags`);
    console.log(`  ✓ Created ${postTagsCreated} post-tag relationships`);
  });

  importData();
  console.log("  ✓ Data import completed successfully");
}
