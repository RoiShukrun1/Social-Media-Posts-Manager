import db from "../db/database";
import type { Author } from "../types";

export class AuthorModel {
  static getAuthorById(id: number): Author | null {
    const query = "SELECT * FROM authors WHERE id = ?";
    return db.prepare(query).get(id) as Author | null;
  }

  static getAuthorByEmail(email: string): Author | null {
    const query = "SELECT * FROM authors WHERE email = ?";
    return db.prepare(query).get(email) as Author | null;
  }

  static createAuthor(author: Omit<Author, "id">): number {
    const stmt = db.prepare(`
      INSERT INTO authors (first_name, last_name, email, company, job_title, bio, follower_count, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      author.first_name,
      author.last_name,
      author.email,
      author.company,
      author.job_title,
      author.bio,
      author.follower_count,
      author.verified ? 1 : 0
    );

    return result.lastInsertRowid as number;
  }

  static updateAuthor(
    id: number,
    author: Partial<Omit<Author, "id">>
  ): boolean {
    const fields: string[] = [];
    const values: (string | number | boolean)[] = [];

    if (author.first_name !== undefined) {
      fields.push("first_name = ?");
      values.push(author.first_name);
    }
    if (author.last_name !== undefined) {
      fields.push("last_name = ?");
      values.push(author.last_name);
    }
    if (author.email !== undefined) {
      fields.push("email = ?");
      values.push(author.email);
    }
    if (author.company !== undefined) {
      fields.push("company = ?");
      values.push(author.company);
    }
    if (author.job_title !== undefined) {
      fields.push("job_title = ?");
      values.push(author.job_title);
    }
    if (author.bio !== undefined) {
      fields.push("bio = ?");
      values.push(author.bio);
    }
    if (author.follower_count !== undefined) {
      fields.push("follower_count = ?");
      values.push(author.follower_count);
    }
    if (author.verified !== undefined) {
      fields.push("verified = ?");
      values.push(author.verified ? 1 : 0);
    }

    if (fields.length === 0) {
      return false;
    }

    const query = `UPDATE authors SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const stmt = db.prepare(query);
    const result = stmt.run(...values);

    return result.changes > 0;
  }
}
