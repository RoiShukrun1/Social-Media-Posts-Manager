/**
 * tagModel.ts
 *
 * Tag data access layer.
 * Provides methods for retrieving all tags sorted alphabetically.
 * Tags are managed automatically through post operations.
 */

import db from "../db/database";
import type { Tag } from "../types";

export class TagModel {
  static getAllTags(): Tag[] {
    const query = "SELECT * FROM tags ORDER BY name";
    return db.prepare(query).all() as Tag[];
  }
}
