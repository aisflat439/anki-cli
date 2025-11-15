import { createContext, useContext, useState, type ReactNode } from "react";
import { useKeyboard } from "@opentui/react";

export type View =
  | "menu"
  | "study"
  | "stats"
  | "add-card"
  | "decks"
  | "deck-detail";

interface RouteParams {
  deckId?: number;
}

interface RouteState {
  view: View;
  params: RouteParams;
}

interface RouterContextType {
  currentView: View;
  params: RouteParams;
  navigate: (view: View, params?: RouteParams) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<RouteState[]>([
    { view: "menu", params: {} },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentRoute = history[currentIndex]!;
  const currentView = currentRoute.view;
  const params = currentRoute.params;

  const navigate = (view: View, newParams?: RouteParams) => {
    const newRoute: RouteState = { view, params: newParams || {} };

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newRoute);

    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      process.exit(0);
    }
  };

  useKeyboard((key) => {
    if (key.name === "escape") {
      goBack();
      return true;
    }
    // Don't handle other keys - let components handle them
    return false;
  });

  return (
    <RouterContext.Provider value={{ currentView, params, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useNavigate must be used within RouterProvider");
  }
  return context.navigate;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }
  return context;
}
