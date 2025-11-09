import { db } from "../db";
import { decks } from "../schema";
import { eq } from "drizzle-orm";

export async function createDeck(name: string, description?: string) {
  const [deck] = await db
    .insert(decks)
    .values({ name, description })
    .returning();
  return deck;
}

export async function getAllDecks() {
  return await db.select().from(decks);
}

export async function getDeckById(id: number) {
  const [deck] = await db.select().from(decks).where(eq(decks.id, id));
  return deck;
}

export async function updateDeck(
  id: number,
  data: { name?: string; description?: string }
) {
  const [deck] = await db
    .update(decks)
    .set(data)
    .where(eq(decks.id, id))
    .returning();
  return deck;
}

export async function deleteDeck(id: number) {
  await db.delete(decks).where(eq(decks.id, id));
}
