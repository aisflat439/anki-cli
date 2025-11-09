import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const decks = sqliteTable("decks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const cards = sqliteTable("cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deckId: integer("deck_id")
    .notNull()
    .references(() => decks.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cardId: integer("card_id")
    .notNull()
    .references(() => cards.id),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  quality: integer("quality").notNull(), // 0-5: 0=complete blackout, 5=perfect
  nextReviewDate: integer("next_review_date", { mode: "timestamp" }).notNull(),
  interval: integer("interval").notNull(), // days until next review
  easeFactor: real("ease_factor").notNull(), // multiplier for spacing (typically starts at 2.5)
});

export const decksRelations = relations(decks, ({ many }) => ({
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  card: one(cards, {
    fields: [reviews.cardId],
    references: [cards.id],
  }),
}));
