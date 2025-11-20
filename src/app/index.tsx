import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Study } from "./Study";
import { Stats } from "./Stats";
import { AddCard } from "./AddCard";
import { EditCard } from "./EditCard";
import { Decks } from "./Decks";
import { DeckDetail } from "./DeckDetail";
import { Main } from "./Main";
import { RouterProvider, useRouter } from "./Router";

const queryClient = new QueryClient();

function AppContent() {
  const { currentView, params } = useRouter();

  // Render different views
  switch (currentView) {
    case "study":
      return <Study />;
    case "stats":
      return <Stats />;
    case "add-card":
      return <AddCard deckId={params.deckId} />;
    case "edit-card":
      return <EditCard cardId={params.cardId!} />;
    case "decks":
      return <Decks />;
    case "deck-detail":
      return <DeckDetail deckId={params.deckId!} />;
    case "menu":
    default:
      return <Main />;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </QueryClientProvider>
  );
}
