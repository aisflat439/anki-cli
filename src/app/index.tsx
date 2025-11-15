import type { SelectOption } from "@opentui/core";
import type { CliRenderer } from "@opentui/core";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Study } from "./Study";
import { Stats } from "./Stats";
import { AddCard } from "./AddCard";
import { Decks } from "./Decks";
import { Main } from "./Main";
import { LogProvider, useLog } from "./LogProvider";

const queryClient = new QueryClient();

type View = "menu" | "study" | "stats" | "add-card" | "add-deck";

function AppContent() {
  const [currentView, setCurrentView] = useState<View>("menu");
  const { log } = useLog();

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
    return <Decks />;
  }

  // Main menu view
  return <Main onSelect={handleMenuSelect} />;
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
