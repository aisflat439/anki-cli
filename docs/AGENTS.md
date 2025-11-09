# Working with AI Agents on this Project

## Communication Style

I prefer **pair programming** - working on one thing at a time in small, manageable chunks.

### Do's ✅
- Work on **one task at a time**
- Make **small, incremental changes**
- **Discuss before implementing** - ask questions, propose solutions
- **Explain what you're doing** as you do it
- Keep changes focused and reviewable

### Don'ts ❌
- Don't make sweeping changes across multiple files at once
- Don't implement multiple features simultaneously
- Don't assume what I want - ask if unclear
- Don't create files without discussing first

## Project Context

This is an **Anki-style flashcard CLI app** built with:
- **Bun** - JavaScript runtime
- **Drizzle ORM** - Type-safe database layer with SQLite
- **OpenTUI** - Terminal UI framework (React-based)

### OpenTUI Documentation

OpenTUI is a React-based framework for building terminal UIs. Key resources:

- **Official Docs**: https://opentui.dev/docs
- **Getting Started**: https://opentui.dev/docs/getting-started
- **Components**: https://opentui.dev/docs/components
- **Examples**: https://opentui.dev/docs/examples

**Key OpenTUI Concepts:**
- Uses JSX/React components (like `<box>`, `<text>`)
- Flexbox-based layout system
- Terminal-specific styling and attributes
- Event handling for keyboard/mouse input

When working with UI components, **always reference the OpenTUI docs** for:
- Available components and their props
- Layout and styling options
- Event handling patterns
- Best practices for terminal UIs

## Project Structure

```
src/
├── db/
│   ├── domain/       # Domain logic for each entity
│   │   ├── decks.ts
│   │   ├── cards.ts
│   │   └── reviews.ts
│   ├── scripts/      # Database utilities
│   │   ├── seed.ts
│   │   └── reset.ts
│   ├── schema.ts     # Drizzle schema definitions
│   └── db.ts         # Database connection
└── index.tsx         # Main app entry point
docs/
├── PROJECT_PLAN.md   # Roadmap and milestones
├── AGENTS.md         # This file
└── anki-cli.md       # Additional documentation
```

## Database Commands

```bash
bun db:reset   # Clear all data
bun db:seed    # Populate with sample data
bun db:push    # Push schema changes
bun db:studio  # Open Drizzle Studio
```

## Development Workflow

1. **Discuss** - Talk through what we're building
2. **Plan** - Break it into small steps
3. **Implement** - One step at a time
4. **Test** - Run and verify it works
5. **Iterate** - Refine based on feedback

## Questions?

When unsure, **always ask** rather than assume. I'd rather discuss options than have you make assumptions about what I want.
