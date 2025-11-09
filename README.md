# anki-cli

A CLI flashcard app built with OpenTUI, Drizzle ORM, and Bun SQLite.

## Setup

Install dependencies:

```bash
bun install
```

Setup the database:

```bash
bun db:push   # Create database tables
bun db:seed   # Populate with sample data
```

## Development

Run the app:

```bash
bun dev
```

## Database Commands

```bash
bun db:reset   # Clear all data from the database
bun db:seed    # Seed the database with sample data
bun db:push    # Push schema changes to the database
bun db:studio  # Open Drizzle Studio to browse the database
```

## Tech Stack

- **OpenTUI** - Terminal UI framework
- **Drizzle ORM** - Type-safe database ORM
- **Bun SQLite** - Native SQLite driver
- **React** - UI components

This project was created using `bun create tui`. [create-tui](https://git.new/create-tui) is the easiest way to get started with OpenTUI.
