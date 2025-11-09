import { Database } from "bun:sqlite";

// Initialize the database
const db = new Database("anki.db");

// Create a simple table for demo purposes
db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
  )
`);

// Helper functions
export function addItem(name: string) {
  const query = db.query("INSERT INTO items (name) VALUES (?)");
  query.run(name);
}

export function getItems() {
  const query = db.query("SELECT * FROM items");
  return query.all();
}

export default db;
