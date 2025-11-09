import { db } from "../db";
import { reviews } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createReview(
  cardId: number,
  quality: number,
  nextReviewDate: Date,
  interval: number,
  easeFactor: number
) {
  const [review] = await db
    .insert(reviews)
    .values({
      cardId,
      quality,
      nextReviewDate,
      interval,
      easeFactor,
    })
    .returning();
  return review;
}

export async function getAllReviews() {
  return await db.select().from(reviews);
}

export async function getReviewById(id: number) {
  const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
  return review;
}

export async function getReviewsByCardId(cardId: number) {
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.cardId, cardId))
    .orderBy(desc(reviews.reviewedAt));
}

export async function getLatestReviewForCard(cardId: number) {
  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.cardId, cardId))
    .orderBy(desc(reviews.reviewedAt))
    .limit(1);
  return review;
}

export async function deleteReview(id: number) {
  await db.delete(reviews).where(eq(reviews.id, id));
}
