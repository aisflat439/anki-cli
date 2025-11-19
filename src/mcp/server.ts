#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getAllDecks, createDeck } from "../db/domain/decks";
import { createCard } from "../db/domain/cards";
import { getNextCardForReview, getCardsForReview, reviewCard } from "../db/domain/reviews";

const server = new McpServer({
  name: "anki-cli",
  version: "0.1.0",
});

// Register list_decks tool
server.registerTool(
  "list_decks",
  {
    description: "Get all available flashcard decks",
  },
  async () => {
    const decks = await getAllDecks();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(decks, null, 2),
        },
      ],
    };
  }
);

// Register create_deck tool
server.registerTool(
  "create_deck",
  {
    description: "Create a new flashcard deck",
    inputSchema: {
      name: z.string().describe("Name of the deck"),
      description: z.string().optional().describe("Description of the deck"),
    },
  },
  async (args) => {
    const deck = await createDeck(args.name, args.description);
    return {
      content: [
        {
          type: "text" as const,
          text: `Created deck: ${deck!.name} (ID: ${deck!.id})`,
        },
      ],
    };
  }
);

// Register add_card tool
server.registerTool(
  "add_card",
  {
    description: "Add a flashcard to a deck",
    inputSchema: {
      deckId: z.number().describe("ID of the deck to add the card to"),
      front: z.string().describe("Front of the card (question)"),
      back: z.string().describe("Back of the card (answer)"),
    },
  },
  async (args) => {
    const card = await createCard(args.deckId, args.front, args.back);
    return {
      content: [
        {
          type: "text" as const,
          text: `Added card to deck ${args.deckId}: "${args.front}" → "${args.back}"`,
        },
      ],
    };
  }
);

// Register get_cards_for_review tool
server.registerTool(
  "get_cards_for_review",
  {
    description: "Get all cards that are due for review. Returns full list of cards ready to study.",
  },
  async () => {
    const cards = await getCardsForReview();
    
    if (cards.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: "No cards due for review at this time.",
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(cards, null, 2),
        },
      ],
    };
  }
);

// Register get_card_to_review tool
server.registerTool(
  "get_card_to_review",
  {
    description: "Get the next card due for review. Returns only the question (front of card). Use submit_review after the user answers.",
  },
  async () => {
    const card = await getNextCardForReview();
    
    if (!card) {
      return {
        content: [
          {
            type: "text" as const,
            text: "No cards due for review at this time.",
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            cardId: card.cardId,
            question: card.question,
            deckId: card.deckId,
            isNew: card.nextReviewDate === null,
          }, null, 2),
        },
      ],
    };
  }
);

// Register submit_review tool
server.registerTool(
  "submit_review",
  {
    description: "Submit a review for a card. Accepts quality rating (1-4 or 'again'/'hard'/'good'/'easy'). Records the review and updates the schedule.",
    inputSchema: {
      cardId: z.number().describe("ID of the card being reviewed"),
      rating: z.union([
        z.number().min(1).max(4),
        z.enum(["again", "hard", "good", "easy"])
      ]).describe("Quality rating: 1/again, 2/hard, 3/good, 4/easy"),
    },
  },
  async (args) => {
    // Convert text ratings to numbers
    let quality: number;
    if (typeof args.rating === "string") {
      const ratingMap: Record<string, number> = {
        again: 1,
        hard: 2,
        good: 3,
        easy: 4,
      };
      quality = ratingMap[args.rating]!;
    } else {
      quality = args.rating;
    }

    // Record the review
    const review = await reviewCard(args.cardId, quality);
    
    if (!review) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: Failed to record review for card ${args.cardId}`,
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            cardId: args.cardId,
            rating: args.rating,
            nextReviewDate: review.nextReviewDate,
            intervalDays: review.interval,
          }, null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Anki MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
