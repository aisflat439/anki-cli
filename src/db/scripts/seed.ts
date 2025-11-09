import { createDeck } from "../decks";
import { db } from "../db";
import { cards, reviews } from "../schema";

export async function seed() {
  console.log("Seeding database...");

  // Create 2 decks
  const deck1 = await createDeck(
    "JavaScript Basics",
    "Core JavaScript concepts and syntax"
  );
  const deck2 = await createDeck("Web APIs", "Common web browser APIs");

  if (!deck1 || !deck2) {
    throw new Error("Failed to create decks");
  }

  console.log(`Created decks: ${deck1.name}, ${deck2.name}`);

  const deck1Cards = await db
    .insert(cards)
    .values([
      {
        deckId: deck1.id,
        question: "What is a closure in JavaScript?",
        answer:
          "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.",
      },
      {
        deckId: deck1.id,
        question: "What is the difference between let and var?",
        answer:
          "let is block-scoped and cannot be redeclared in the same scope, while var is function-scoped and can be redeclared.",
      },
      {
        deckId: deck1.id,
        question: "What does 'use strict' do?",
        answer:
          "It enables strict mode, which catches common coding mistakes and prevents certain actions like using undeclared variables.",
      },
    ])
    .returning();

  console.log(`Created ${deck1Cards.length} cards for ${deck1.name}`);

  const deck2Cards = await db
    .insert(cards)
    .values([
      {
        deckId: deck2.id,
        question: "What is localStorage?",
        answer:
          "A web storage API that allows storing key-value pairs in a browser with no expiration time.",
      },
      {
        deckId: deck2.id,
        question: "What is the Fetch API used for?",
        answer:
          "Making HTTP requests to servers and handling responses using Promises.",
      },
      {
        deckId: deck2.id,
        question:
          "What is the difference between sessionStorage and localStorage?",
        answer:
          "sessionStorage data is cleared when the page session ends, while localStorage persists until explicitly deleted.",
      },
    ])
    .returning();

  console.log(`Created ${deck2Cards.length} cards for ${deck2.name}`);

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reviewsData = deck1Cards.map((card, index) => ({
    cardId: card.id,
    reviewedAt: new Date(now.getTime() - (index + 1) * 3600000), // 1, 2, 3 hours ago
    quality: 3 + index, // quality 3, 4, 5 (good to perfect)
    nextReviewDate: new Date(tomorrow.getTime() + index * 86400000), // 1, 2, 3 days from tomorrow
    interval: index + 1, // 1, 2, 3 days
    easeFactor: 2.5 + index * 0.1, // 2.5, 2.6, 2.7
  }));

  await db.insert(reviews).values(reviewsData);

  console.log(`Created ${reviewsData.length} reviews for ${deck1.name}`);
  console.log("Seed completed!");
}

if (import.meta.main) {
  await seed();
  process.exit(0);
}
