import type { SelectOption } from "@opentui/core";
import type { CliRenderer } from "@opentui/core";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Study } from "./Study";
import { Stats } from "./Stats";
import { AddCard } from "./AddCard";
import { AddDeck } from "./AddDeck";
import { LogProvider, useLog } from "./LogProvider";

const queryClient = new QueryClient();

type View = "menu" | "study" | "stats" | "add-card" | "add-deck";

function AppContent() {
  const [currentView, setCurrentView] = useState<View>("menu");
  const { log } = useLog();

  const menuOptions: SelectOption[] = [
    { name: "Study", description: "Review flashcards", value: "study" },
    { name: "Stats", description: "View your progress", value: "stats" },
    {
      name: "Add Card",
      description: "Create a new flashcard",
      value: "add-card",
    },
    { name: "Add Deck", description: "Create a new deck", value: "add-deck" },
  ];

  useKeyboard((key) => {
    if (key.name === "escape") {
      if (currentView === "menu") {
        process.exit(0);
      } else {
        log("Going back to menu");
        setCurrentView("menu");
      }
    }
  });

  const handleMenuSelect = (_index: number, option: SelectOption | null) => {
    if (!option) return;
    log(`Selected: ${option.name}`);
    setCurrentView(option.value as View);
  };

  // Render different views
  if (currentView === "study") {
    return <Study />;
  }

  if (currentView === "stats") {
    return <Stats />;
  }

  if (currentView === "add-card") {
    return <AddCard />;
  }

  if (currentView === "add-deck") {
    return <AddDeck />;
  }

  // Main menu view
  return (
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <box flexDirection="column" style={{ padding: 2 }}>
        <text style={{ marginBottom: 1 }}>Anki CLI - Main Menu</text>

        <box style={{ border: true, height: 10 }}>
          <select
            options={menuOptions}
            focused={true}
            showDescription={true}
            onSelect={handleMenuSelect}
            style={{ height: 8 }}
          />
        </box>

        <text attributes={1} style={{ marginTop: 1 }}>
          ↑/↓: Navigate | Enter: Select | ESC: Quit
        </text>
      </box>
    </box>
  );
}

export function App({ renderer }: { renderer: CliRenderer }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LogProvider renderer={renderer}>
        <AppContent />
      </LogProvider>
    </QueryClientProvider>
  );
}
