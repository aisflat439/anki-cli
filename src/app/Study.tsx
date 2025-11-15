import { useQuery } from "@tanstack/react-query";
import { getCardsForReview } from "../db/domain/reviews";
import { Frame } from "./Frame";

export function Study() {
  const { data: cards, isLoading } = useQuery({
    queryKey: ["cards-for-review"],
    queryFn: getCardsForReview,
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

  return (
    <Frame title="Study">
      <box flexDirection="column" style={{ gap: 1 }}>
        <text>{`Cards to review: ${cards.length}`}</text>
        {cards.map((card) => (
          <text key={card.cardId}>
            {`${card.question} (Due: ${card.nextReviewDate ? new Date(card.nextReviewDate).toLocaleDateString() : "New"})`}
          </text>
        ))}
      </box>
    </Frame>
  );
}
