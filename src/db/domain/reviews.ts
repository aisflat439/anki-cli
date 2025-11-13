import { db } from "../db";
import { reviews } from "../schema";
import { eq, desc } from "drizzle-orm";

type ReviewId = Pick<typeof reviews.$inferSelect, "id">;
type ReviewCardId = Pick<typeof reviews.$inferSelect, "cardId">;

export async function createReview(
  data: typeof reviews.$inferInsert
) {
  const [review] = await db
    .insert(reviews)
    .values(data)
    .returning();
  return review;
}

export async function getAllReviews() {
  return await db.select().from(reviews);
}

export async function getReviewById({ id }: ReviewId) {
  const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
  return review;
}

export async function getReviewsByCardId({ cardId }: ReviewCardId) {
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.cardId, cardId))
    .orderBy(desc(reviews.reviewedAt));
}

export async function getLatestReviewForCard({ cardId }: ReviewCardId) {
  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.cardId, cardId))
    .orderBy(desc(reviews.reviewedAt))
    .limit(1);
  return review;
}

export async function deleteReview({ id }: ReviewId) {
  await db.delete(reviews).where(eq(reviews.id, id));
}

export async function getReviewActivityByDay() {
  const allReviews = await db.select().from(reviews);
  
  // Group reviews by day
  const reviewsByDay = new Map<string, number>();
  
  for (const review of allReviews) {
    if (!review.reviewedAt) continue;
    const date = new Date(review.reviewedAt);
    const dayKey = date.toISOString().split('T')[0]!; // YYYY-MM-DD format
    reviewsByDay.set(dayKey, (reviewsByDay.get(dayKey) || 0) + 1);
  }
  
  return reviewsByDay;
}
