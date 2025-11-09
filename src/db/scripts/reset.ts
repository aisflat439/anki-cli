import { db } from "../db";
import { decks, cards, reviews } from "../schema";

async function reset() {
  console.log("Resetting database...");

  // Delete all data in reverse order (due to foreign keys)
  await db.delete(reviews);
  console.log("Deleted all reviews");

  await db.delete(cards);
  console.log("Deleted all cards");

  await db.delete(decks);
  console.log("Deleted all decks");

  console.log("Database reset complete!");
}

if (import.meta.main) {
  await reset();
  process.exit(0);
}
