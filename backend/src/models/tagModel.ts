import db from "../db/database";
import type { Tag } from "../types";

export class TagModel {
  static getAllTags(): Tag[] {
    const query = "SELECT * FROM tags ORDER BY name";
    return db.prepare(query).all() as Tag[];
  }
}
