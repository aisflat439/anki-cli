import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useKeyboard } from "@opentui/react";
import { getCardsForReview } from "../db/domain/reviews";
import { Frame } from "./Frame";

export function Study() {
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: cards, isLoading } = useQuery({
    queryKey: ["cards-for-review"],
    queryFn: getCardsForReview,
  });

  useKeyboard((key) => {
    if (key.name === "space") {
      setIsFlipped(!isFlipped);
    }
  });

  if (isLoading) {
    return (
      <Frame title="Study">
        <text>Loading cards...</text>
      </Frame>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <Frame title="Study">
        <text>No cards to review!</text>
      </Frame>
    );
  }

  // Automatically start studying - show the outlet
  const currentCard = cards[0]!; // Start with first card

  return (
    <Frame title="Study">
      <box flexDirection="column" flexGrow={1}>
        {/* Card content area - grows to fill space */}
        <box flexGrow={1}>
          <text>{isFlipped ? currentCard.answer : currentCard.question}</text>
        </box>

        {/* Difficulty options in bordered box at bottom */}
        <box style={{ border: true, padding: 1 }}>
          <text>Space: Flip | 1: Again | 2: Hard | 3: Good | 4: Easy</text>
        </box>
      </box>
    </Frame>
  );
}
