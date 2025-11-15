import type { SelectOption } from "@opentui/core";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Study } from "./Study";
import { Stats } from "./Stats";
import { AddCard } from "./AddCard";
import { Decks } from "./Decks";
import { Main } from "./Main";

const queryClient = new QueryClient();

type View = "menu" | "study" | "stats" | "add-card" | "decks";

function AppContent() {
  const [currentView, setCurrentView] = useState<View>("menu");

  useKeyboard((key) => {
    if (key.name === "escape") {
      if (currentView === "menu") {
        process.exit(0);
      } else {
        setCurrentView("menu");
      }
    }
  });

  const handleMenuSelect = (_index: number, option: SelectOption | null) => {
    if (!option) return;
    setCurrentView(option.value as View);
  };

  // Render different views
  switch (currentView) {
    case "study":
      return <Study />;
    case "stats":
      return <Stats />;
    case "add-card":
      return <AddCard />;
    case "decks":
      return <Decks />;
    case "menu":
    default:
      return <Main onSelect={handleMenuSelect} />;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
