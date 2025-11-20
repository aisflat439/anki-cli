import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useKeyboard } from "@opentui/react";
import type { SelectOption } from "@opentui/core";
import { getDeckById } from "../db/domain/decks";
import { getCardsByDeckId, deleteCard } from "../db/domain/cards";
import { useNavigate } from "./Router";
import { Frame } from "./Frame";

type DeckDetailProps = {
  deckId: number;
};

export function DeckDetail({ deckId }: DeckDetailProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const { data: deck, isLoading: deckLoading } = useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => getDeckById(deckId),
  });

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getCardsByDeckId(deckId),
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: number) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", deckId] });
      setSelectedCardId(null);
    },
  });

  useKeyboard((key) => {
    if (key.name === "a") {
      navigate("add-card", { deckId });
      return true;
    }
    
    if (key.name === "e" && selectedCardId) {
      navigate("edit-card", { cardId: selectedCardId });
      return true;
    }
    
    if (key.name === "d" && selectedCardId) {
      deleteCardMutation.mutate(selectedCardId);
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

  const cardOptions: SelectOption[] = (cards || []).map((card) => ({
    name: card.question,
    description: card.answer,
    value: card.id,
  }));

  const handleSelect = (_index: number, option: SelectOption | null) => {
    if (option) {
      setSelectedCardId(option.value as number);
    }
  };

  return (
    <Frame 
      title={deck.name} 
      footer={selectedCardId 
        ? "A: Add | E: Edit | D: Delete | ESC: Back" 
        : "A: Add Card | ESC: Back"
      }
    >
      <box flexDirection="column" style={{ gap: 1 }}>
        <text>{`Cards: ${cards?.length || 0}`}</text>
        
        <box style={{ border: true, height: 15 }}>
          {cards && cards.length > 0 ? (
            <select
              options={cardOptions}
              focused={true}
              showDescription={true}
              onSelect={handleSelect}
              style={{ height: 13 }}
            />
          ) : (
            <text>No cards in this deck yet</text>
          )}
        </box>
      </box>
    </Frame>
  );
}
