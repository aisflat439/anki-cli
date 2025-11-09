import { db } from "./db";
import { cards } from "./schema";
import { eq } from "drizzle-orm";

export async function createCard(
  deckId: number,
  question: string,
  answer: string
) {
  const [card] = await db
    .insert(cards)
    .values({ deckId, question, answer })
    .returning();
  return card;
}

export async function getAllCards() {
  return await db.select().from(cards);
}

export async function getCardById(id: number) {
  const [card] = await db.select().from(cards).where(eq(cards.id, id));
  return card;
}

export async function getCardsByDeckId(deckId: number) {
  return await db.select().from(cards).where(eq(cards.deckId, deckId));
}

export async function updateCard(
  id: number,
  data: { question?: string; answer?: string; deckId?: number }
) {
  const [card] = await db
    .update(cards)
    .set(data)
    .where(eq(cards.id, id))
    .returning();
  return card;
}

export async function deleteCard(id: number) {
  await db.delete(cards).where(eq(cards.id, id));
}
