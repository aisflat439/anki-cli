import { createDeck } from "../domain/decks";
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

  // Create reviews spread over the last 90 days to show activity
  const reviewsData = [];
  const allCards = [...deck1Cards, ...deck2Cards];
  
  for (let daysAgo = 0; daysAgo < 90; daysAgo++) {
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - daysAgo);
    
    // Random number of reviews per day (0-10)
    const reviewCount = Math.floor(Math.random() * 11);
    
    for (let i = 0; i < reviewCount; i++) {
      const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
      if (!randomCard) continue;
      reviewsData.push({
        cardId: randomCard.id,
        reviewedAt: new Date(reviewDate.getTime() + i * 60000), // Spread throughout the day
        quality: Math.floor(Math.random() * 4) + 2, // quality 2-5
        nextReviewDate: new Date(reviewDate.getTime() + 86400000), // next day
        interval: Math.floor(Math.random() * 7) + 1, // 1-7 days
        easeFactor: 2.5,
      });
    }
  }

  await db.insert(reviews).values(reviewsData);

  console.log(`Created ${reviewsData.length} reviews across 90 days`);
  console.log("Seed completed!");
}

if (import.meta.main) {
  await seed();
  process.exit(0);
}
