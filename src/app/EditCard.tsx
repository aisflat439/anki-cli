import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCardById, updateCard } from "../db/domain/cards";
import { Frame } from "./Frame";
import { CardEntry } from "../components/CardEntry";

type CardFormState = {
  step: number;
  front: string;
  back: string;
};

type EditCardProps = {
  cardId: number;
};

export function EditCard({ cardId }: EditCardProps) {
  const queryClient = useQueryClient();

  const { data: card, isLoading } = useQuery({
    queryKey: ["card", cardId],
    queryFn: () => getCardById(cardId),
  });

  const [form, setForm] = useState<CardFormState>({
    step: 1,
    front: "",
    back: "",
  });

  // Initialize form with card data
  useEffect(() => {
    if (card) {
      setForm({
        step: 1,
        front: card.question,
        back: card.answer,
      });
    }
  }, [card]);

  const updateCardMutation = useMutation({
    mutationFn: ({
      question,
      answer,
    }: {
      question: string;
      answer: string;
    }) => updateCard(cardId, { question, answer }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });

  if (isLoading) {
    return (
      <Frame title="Loading...">
        <text>Loading card...</text>
      </Frame>
    );
  }

  if (!card) {
    return (
      <Frame title="Error">
        <text>Card not found</text>
      </Frame>
    );
  }

  if (form.step === 1) {
    return (
      <Frame
        title="Edit Card - Front"
        footer="Type your question | Enter: Next | ESC: Cancel"
      >
        <CardEntry
          label="Edit the front of the card (question):"
          value={form.front}
          onChange={(value) => setForm({ ...form, front: value })}
          onSubmit={(value) => {
            if (value.trim()) {
              setForm({ ...form, front: value, step: 2 });
            }
          }}
          placeholder="What is the capital of France?"
        />
      </Frame>
    );
  }

  if (form.step === 2) {
    return (
      <Frame
        title="Edit Card - Back"
        footer="Type your answer | Enter: Save | ESC: Back"
      >
        <box flexDirection="column" style={{ gap: 1 }}>
          <text>{`Front: ${form.front}`}</text>
          <CardEntry
            label="Edit the back of the card (answer):"
            value={form.back}
            onChange={(value) => setForm({ ...form, back: value })}
            onSubmit={(value) => {
              if (value.trim()) {
                updateCardMutation.mutate({
                  question: form.front,
                  answer: value,
                });
              }
            }}
            placeholder="Paris"
          />
        </box>
      </Frame>
    );
  }

  if (updateCardMutation.isPending) {
    return (
      <Frame title="Saving...">
        <text>Updating card...</text>
      </Frame>
    );
  }

  if (updateCardMutation.isError) {
    return (
      <Frame title="Error">
        <text>{`Error: ${updateCardMutation.error}`}</text>
      </Frame>
    );
  }

  if (updateCardMutation.isSuccess) {
    return (
      <Frame title="Success">
        <text>Card updated successfully!</text>
      </Frame>
    );
  }

  return null;
}
