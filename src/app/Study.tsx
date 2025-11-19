import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useKeyboard } from "@opentui/react";
import { getCardsForReview, reviewCard } from "../db/domain/reviews";
import { Frame } from "./Frame";

type StudyState = {
  currentCardIndex: number;
  isFlipped: boolean;
};

export function Study() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<StudyState>({
    currentCardIndex: 0,
    isFlipped: false,
  });

  const { data: cards, isLoading } = useQuery({
    queryKey: ["cards-for-review"],
    queryFn: getCardsForReview,
  });

  const saveReviewMutation = useMutation({
    mutationFn: ({ cardId, quality }: { cardId: number; quality: number }) =>
      reviewCard(cardId, quality),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards-for-review"] });
    },
  });

  const shuffledCards = useMemo(() => {
    if (!cards) return [];
    const shuffled = [...cards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }

    return shuffled;
  }, [cards]);

  const handleDifficultyRating = (rating: number) => {
    const nextIndex = state.currentCardIndex + 1;

    if (rating >= 2 && rating <= 4) {
      const currentCard = shuffledCards[state.currentCardIndex]!;
      saveReviewMutation.mutate({
        cardId: currentCard.cardId,
        quality: rating,
      });
    }

    setState({
      currentCardIndex: nextIndex,
      isFlipped: false,
    });
  };

  useKeyboard((key) => {
    if (key.name === "space") {
      setState({ ...state, isFlipped: !state.isFlipped });
      return true;
    }

    if (["1", "2", "3", "4"].includes(key.name)) {
      if (!state.isFlipped) return false;

      const rating = parseInt(key.name!);
      handleDifficultyRating(rating);
      return true;
    }
  });

  if (isLoading) {
    return (
      <Frame title="Study">
        <text>Loading cards...</text>
      </Frame>
    );
  }

  if (!shuffledCards || shuffledCards.length === 0) {
    return (
      <Frame title="Study">
        <text>No cards to review!</text>
      </Frame>
    );
  }

  if (state.currentCardIndex >= shuffledCards.length) {
    return (
      <Frame title="Study Complete!">
        <text>Great job! You've reviewed all cards.</text>
      </Frame>
    );
  }

  const currentCard = shuffledCards[state.currentCardIndex]!;
  const cardsRemaining = shuffledCards.length - state.currentCardIndex;

  return (
    <Frame title={`Study (${cardsRemaining} left)`}>
      <box flexDirection="column" flexGrow={1}>
        <box flexGrow={1}>
          <text>
            {state.isFlipped ? currentCard.answer : currentCard.question}
          </text>
        </box>

        <box style={{ border: true, padding: 1 }}>
          <text>Space: Flip | 1: Again | 2: Hard | 3: Good | 4: Easy</text>
        </box>
      </box>
    </Frame>
  );
}
