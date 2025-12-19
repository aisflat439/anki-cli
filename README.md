# anki-cli

A terminal flashcard app with spaced repetition and AI integration.

https://github.com/user-attachments/assets/ddc4fa3d-b378-409f-b074-bd1ff82d03f0

## Install

```bash
bun install -g anki-cli
```

## Usage

Run the app:

```bash
anki
```

**Keyboard shortcuts:**
- `↑/↓` - Navigate menus
- `Enter` - Select
- `ESC` - Go back
- `Space` - Flip card (in study mode)
- `1-4` - Rate difficulty (Again/Hard/Good/Easy)

## Use with AI (OpenCode)

Add this to your `opencode.jsonc`:

```jsonc
{
  "mcp": {
    "anki": {
      "type": "local",
      "command": ["anki-mcp"],
      "enabled": true
    }
  }
}
```

Then ask your AI to create cards, start reviews, or manage your decks.

## Tech Stack

- **OpenTUI** - Terminal UI framework
- **Drizzle ORM** - SQLite database
- **Bun** - JavaScript runtime
- **MCP** - Model Context Protocol for AI integration
