import db from '../db/database';
import type { Tag } from '../types';

export class TagModel {
  static getAllTags(): Tag[] {
    const query = 'SELECT * FROM tags ORDER BY name';
    return db.prepare(query).all() as Tag[];
  }

  static getTagsWithCounts(): Array<Tag & { post_count: number }> {
    const query = `
      SELECT t.*, COUNT(pt.post_id) as post_count
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      GROUP BY t.id
      ORDER BY post_count DESC, t.name
    `;
    return db.prepare(query).all() as Array<Tag & { post_count: number }>;
  }

  static getTagById(id: number): Tag | null {
    const query = 'SELECT * FROM tags WHERE id = ?';
    return db.prepare(query).get(id) as Tag | null;
  }
}

