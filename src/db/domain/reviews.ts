import { db, sqlite } from "../db";
import { reviews } from "../schema";
import { eq, desc, gte, sql } from "drizzle-orm";

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

export async function getReviewActivityByDayLastYear() {
  // Only fetch reviews from the last 52 weeks
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - (52 * 7));
  
  const recentReviews = await db
    .select()
    .from(reviews)
    .where(gte(reviews.reviewedAt, oneYearAgo));
  
  // Group reviews by day
  const reviewsByDay = new Map<string, number>();
  
  for (const review of recentReviews) {
    if (!review.reviewedAt) continue;
    const date = new Date(review.reviewedAt);
    const dayKey = date.toISOString().split('T')[0]!; // YYYY-MM-DD format
    reviewsByDay.set(dayKey, (reviewsByDay.get(dayKey) || 0) + 1);
  }
  
  return reviewsByDay;
}

export async function getReviewStats() {
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - (52 * 7));
  
  // Get daily review counts with raw SQL for streak calculations  
  // Note: reviewed_at is stored as Unix timestamp in seconds
  const dailyCounts = sqlite.query<{ date: string; count: number }, [number]>(
    `SELECT 
      DATE(reviewed_at, 'unixepoch') as date,
      COUNT(*) as count
    FROM reviews
    WHERE reviewed_at >= ?
    GROUP BY DATE(reviewed_at, 'unixepoch')
    ORDER BY date ASC`
  ).all(Math.floor(oneYearAgo.getTime() / 1000));
  
  // Calculate streaks in SQL would be complex, so do it in JS with the sorted data
  let longestStreak = 0;
  let currentStreak = 0;
  let longestHotStreak = 0;
  let currentHotStreak = 0;
  
  const maxCount = Math.max(...dailyCounts.map(d => d.count), 0);
  
  // Generate all dates in range to check for gaps
  const allDates: string[] = [];
  const today = new Date();
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    allDates.push(date.toISOString().split('T')[0]!);
  }
  
  const countMap = new Map(dailyCounts.map(d => [d.date, d.count]));
  
  for (const date of allDates) {
    const count = countMap.get(date) || 0;
    
    // Any activity streak
    if (count > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
    
    // Hot streak (max activity)
    if (count === maxCount && maxCount > 0) {
      currentHotStreak++;
      longestHotStreak = Math.max(longestHotStreak, currentHotStreak);
    } else {
      currentHotStreak = 0;
    }
  }
  
  return {
    totalReviews: dailyCounts.reduce((sum, d) => sum + d.count, 0),
    longestStreak,
    longestHotStreak,
  };
}
