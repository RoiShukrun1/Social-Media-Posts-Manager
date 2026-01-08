import db from "../db/database";
import type { Author } from "../types";

export class AuthorModel {
  static getAllAuthors(): Author[] {
    const query = `
      SELECT * FROM authors
      ORDER BY last_name, first_name
    `;
    return db.prepare(query).all() as Author[];
  }

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
}
