#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getAllDecks, createDeck } from "../db/domain/decks";
import { createCard } from "../db/domain/cards";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Anki MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
