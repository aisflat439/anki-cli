# Anki CLI - Project Plan

## Phase 1: Make it Publishable 📦

### 1.1 Package Configuration
- [ ] Update package.json for npm publishing
  - [ ] Set proper package name (check npm availability)
  - [ ] Add bin entry for CLI command
  - [ ] Set up proper entry points
  - [ ] Add keywords, description, author, license
  - [ ] Define peer dependencies vs dependencies
- [ ] Create .npmignore file
- [ ] Set up build process (if needed)
- [ ] Test local installation (`npm link` or `bun link`)

### 1.2 CLI Setup
- [ ] Add CLI argument parsing (e.g., commander or yargs)
- [ ] Make it executable as a global command (e.g., `anki` or `anki-cli`)
- [ ] Add version flag (`--version`)
- [ ] Add help flag (`--help`)

### 1.3 Database Handling for Published Package
- [ ] Determine where to store user's database
  - [ ] Use user's home directory or XDG config path
  - [ ] Create database on first run
- [ ] Add init command to set up database
- [ ] Handle database migrations gracefully

### 1.4 Documentation
- [ ] Update README with installation instructions
- [ ] Add usage examples
- [ ] Document all commands
- [ ] Add contributing guidelines (if open source)
- [ ] Create changelog

### 1.5 Testing & Quality
- [ ] Test installation process
- [ ] Test on different platforms (macOS, Linux, Windows)
- [ ] Add error handling for common issues
- [ ] Add logging/debug mode

### 1.6 Publishing
- [ ] Create npm account (if needed)
- [ ] Publish to npm
- [ ] Add GitHub releases
- [ ] Set up CI/CD (optional)

## Phase 2: LLM Integration 🤖

### 2.1 Make it LLM-Accessible
- [ ] Design JSON/text format for card input
  - [ ] Support batch card creation from structured data
  - [ ] Accept markdown or JSON format
- [ ] Create `import` command
  - [ ] `anki import <file>` - import cards from file
  - [ ] `anki import --stdin` - import from stdin (for piping)
- [ ] Add `export` command for LLMs to see existing decks
  - [ ] `anki export <deck>` - export deck to stdout
  - [ ] Format for easy LLM consumption

### 2.2 LLM-Friendly Commands
- [ ] `anki create-deck <name>` - simple deck creation
- [ ] `anki add-card <deck> --question "..." --answer "..."` - quick card addition
- [ ] `anki bulk-add <deck>` - interactive multi-card input
- [ ] Standardize output formats (JSON flag for machine-readable output)

### 2.3 Integration Examples
- [ ] Document how to use with Claude/ChatGPT
- [ ] Create example prompts for generating cards
- [ ] Add MCP (Model Context Protocol) server support (optional)
  - [ ] Expose deck/card operations as MCP tools
  - [ ] Allow LLMs to directly read/write cards

### 2.4 Smart Features
- [ ] Auto-generate card IDs that LLMs can reference
- [ ] Support card updates via LLM (not just creation)
- [ ] Conflict resolution for duplicate cards

## Phase 3: Study Features 📚
_Core Anki functionality_

### 3.1 Study Mode
- [ ] Show due cards for review
- [ ] Flip card to reveal answer
- [ ] Rate difficulty (Again, Hard, Good, Easy)
- [ ] Implement spaced repetition algorithm (SM-2)

### 3.2 Progress Tracking
- [ ] Show study statistics
- [ ] Track streaks
- [ ] Cards due today/this week

### 3.3 Deck Management
- [ ] Browse decks
- [ ] Navigate cards in a deck
- [ ] Edit existing cards
- [ ] Delete cards/decks

## Phase 4: Polish & Growth 🚀
_Nice-to-haves_

### 4.1 GitHub-Style Activity Grid 📊
- [ ] Track daily review activity
- [ ] Display contribution-style heatmap in terminal
  - [ ] Show last 365 days of study history
  - [ ] Color intensity based on cards reviewed
  - [ ] Hover/select to see daily stats
- [ ] `anki stats` command to show the grid
- [ ] Show streaks and milestones
- [ ] Weekly/monthly summaries

### 4.2 Import/Export
- [ ] Import from Anki desktop format (.apkg)
- [ ] Export to Anki desktop format
- [ ] CSV import/export

### 4.3 Customization
- [ ] Custom themes/colors
- [ ] Configurable keyboard shortcuts
- [ ] Plugin system for custom study algorithms

### 4.4 Sync & Sharing
- [ ] Sync between devices
- [ ] Share decks with others
- [ ] Web dashboard (view-only)
- [ ] GitHub integration (commit your study streak!)

## Open Questions
- What should the package be called on npm?
- Do you want this to be open source?
- Any specific platforms to prioritize?
- What's the minimum viable feature set for v1.0?
