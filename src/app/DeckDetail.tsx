import { useQuery } from "@tanstack/react-query";
import { useKeyboard } from "@opentui/react";
import { getDeckById } from "../db/domain/decks";
import { getCardsByDeckId } from "../db/domain/cards";
import { useNavigate } from "./Router";
import { Frame } from "./Frame";

type DeckDetailProps = {
  deckId: number;
};

export function DeckDetail({ deckId }: DeckDetailProps) {
  const navigate = useNavigate();

  const { data: deck, isLoading: deckLoading } = useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => getDeckById(deckId),
  });

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getCardsByDeckId(deckId),
  });

  useKeyboard((key) => {
    if (key.name === "a") {
      navigate("add-card", { deckId });
      return true;
    }
  });

  if (deckLoading || cardsLoading) {
    return (
      <Frame title="Loading...">
        <text>Loading deck...</text>
      </Frame>
    );
  }

  if (!deck) {
    return (
      <Frame title="Error">
        <text>Deck not found</text>
      </Frame>
    );
  }

  return (
    <Frame title={deck.name} footer="A: Add Card | ESC: Back">
      <box flexDirection="column" style={{ gap: 1 }}>
        <text>{`Cards: ${cards?.length || 0}`}</text>
        
        <box style={{ border: true, padding: 1 }}>
          {cards && cards.length > 0 ? (
            <box flexDirection="column">
              {cards.map((card: any) => (
                <text key={card.id}>{`- ${card.question}`}</text>
              ))}
            </box>
          ) : (
            <text>No cards in this deck yet</text>
          )}
        </box>
      </box>
    </Frame>
  );
}
