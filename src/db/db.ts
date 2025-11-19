import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { getDbPath } from "../lib/paths";

const dbPath = getDbPath();
const sqlite = new Database(dbPath);

// Initialize database tables if they don't exist
function initDatabase() {
  // Create decks table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER
    )
  `);

  // Create cards table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at INTEGER,
      FOREIGN KEY (deck_id) REFERENCES decks(id)
    )
  `);

  // Create reviews table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER NOT NULL,
      reviewed_at INTEGER,
      quality INTEGER NOT NULL,
      next_review_date INTEGER NOT NULL,
      interval INTEGER NOT NULL,
      ease_factor REAL NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id)
    )
  `);
}

// Run initialization
initDatabase();

export const db = drizzle(sqlite, { schema });

export { sqlite };
