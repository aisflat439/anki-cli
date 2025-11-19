#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getAllDecks } from "../db/domain/decks";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Anki MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
