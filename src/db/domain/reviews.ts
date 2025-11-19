import { db, sqlite } from "../db";
import { reviews, cards } from "../schema";
import { eq, desc, gte, lte, or, isNull, sql } from "drizzle-orm";

type ReviewId = Pick<typeof reviews.$inferSelect, "id">;
type ReviewCardId = Pick<typeof reviews.$inferSelect, "cardId">;

export async function createReview(data: typeof reviews.$inferInsert) {
  const [review] = await db.insert(reviews).values(data).returning();
  return review;
}

/**
 * Create a review for a card based on quality rating.
 * Uses SM-2 (SuperMemo 2) spaced repetition algorithm.
 *
 * @param cardId - The ID of the card being reviewed
 * @param quality - Quality rating (1-4): 1=Again, 2=Hard, 3=Good, 4=Easy
 * @returns The created review
 */
export async function reviewCard(cardId: number, quality: number) {
  const now = new Date();

  const lastReview = await getLatestReviewForCard({ cardId });

  let intervalDays: number;
  let easeFactor: number;

  if (!lastReview) {
    easeFactor = 2.5;
    if (quality === 1)
      intervalDays = 0; // Review again in same session
    else if (quality === 2) intervalDays = 1;
    else if (quality === 3) intervalDays = 1;
    else intervalDays = 4; // quality 4
  } else {
    const prevEase = lastReview.easeFactor;
    const prevInterval = lastReview.interval;

    // Calculate new ease factor: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
    // Simplified: good answers increase ease, bad decrease it
    easeFactor = Math.max(
      1.3,
      prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );

    // Calculate new interval based on quality
    if (quality === 1) {
      // Again - reset to beginning
      intervalDays = 1;
    } else if (quality === 2) {
      // Hard - smaller multiplier
      intervalDays = Math.max(1, Math.round(prevInterval * 1.2));
    } else {
      // Good (3) or Easy (4) - use ease factor
      intervalDays = Math.round(prevInterval * easeFactor);
      if (quality === 4) {
        // Easy gets bonus multiplier
        intervalDays = Math.round(intervalDays * 1.3);
      }
    }
  }

  const nextReviewDate = new Date(
    now.getTime() + intervalDays * 24 * 60 * 60 * 1000,
  );

  return createReview({
    cardId,
    quality,
    reviewedAt: now,
    nextReviewDate,
    interval: intervalDays,
    easeFactor,
  });
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

/**
 * Get all cards that are due for review.
 *
 * Returns cards that match either of these criteria:
 * 1. New cards (never reviewed before) - `nextReviewDate` is null
 * 2. Cards due for review - `nextReviewDate` is <= current time
 *
 * @returns Array of cards with their review information, filtered to only cards ready to study
 *
 * @example
 * const dueCards = await getCardsForReview();
 * // Returns: [
 * //   { cardId: 1, question: "What is 2+2?", nextReviewDate: null }, // new
 * //   { cardId: 5, question: "Capital?", nextReviewDate: 2025-11-14 }  // due
 * // ]
 */
export async function getCardsForReview() {
  const now = new Date();

  const dueCards = await db
    .select({
      cardId: cards.id,
      question: cards.question,
      answer: cards.answer,
      deckId: cards.deckId,
      nextReviewDate: reviews.nextReviewDate,
    })
    .from(cards)
    .leftJoin(
      reviews,
      sql`${reviews.cardId} = ${cards.id} AND ${reviews.id} = (
        SELECT id FROM ${reviews} r2
        WHERE r2.card_id = ${cards.id}
        ORDER BY reviewed_at DESC
        LIMIT 1
      )`,
    )
    .where(
      or(isNull(reviews.nextReviewDate), lte(reviews.nextReviewDate, now)),
    );

  return dueCards;
}

export async function getReviewActivityByDayLastYear() {
  // Only fetch reviews from the last 52 weeks
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 52 * 7);

  const recentReviews = await db
    .select()
    .from(reviews)
    .where(gte(reviews.reviewedAt, oneYearAgo));

  // Group reviews by day
  const reviewsByDay = new Map<string, number>();

  for (const review of recentReviews) {
    if (!review.reviewedAt) continue;
    const date = new Date(review.reviewedAt);
    const dayKey = date.toISOString().split("T")[0]!; // YYYY-MM-DD format
    reviewsByDay.set(dayKey, (reviewsByDay.get(dayKey) || 0) + 1);
  }

  return reviewsByDay;
}

export async function getReviewStats() {
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 52 * 7);

  // Get daily review counts with raw SQL for streak calculations
  // Note: reviewed_at is stored as Unix timestamp in seconds
  const dailyCounts = sqlite
    .query<{ date: string; count: number }, [number]>(
      `SELECT
      DATE(reviewed_at, 'unixepoch') as date,
      COUNT(*) as count
    FROM reviews
    WHERE reviewed_at >= ?
    GROUP BY DATE(reviewed_at, 'unixepoch')
    ORDER BY date ASC`,
    )
    .all(Math.floor(oneYearAgo.getTime() / 1000));

  // Calculate streaks in SQL would be complex, so do it in JS with the sorted data
  let longestStreak = 0;
  let currentStreak = 0;
  let longestHotStreak = 0;
  let currentHotStreak = 0;

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 0);

  // Generate all dates in range to check for gaps
  const allDates: string[] = [];
  const today = new Date();
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    allDates.push(date.toISOString().split("T")[0]!);
  }

  const countMap = new Map(dailyCounts.map((d) => [d.date, d.count]));

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
