import { useState } from "react";
import { Frame } from "./Frame";
import { CardEntry } from "../components/CardEntry";
import { DeckSelector } from "../components/DeckSelector";

type CardFormState = {
  step: number;
  front: string;
  back: string;
  deckId: number | null;
};

export function AddCard() {
  const [form, setForm] = useState<CardFormState>({
    step: 1,
    front: "",
    back: "",
    deckId: null,
  });

  if (form.step === 1) {
    return (
      <Frame title="Add Card - Front" footer="Type your question | Enter: Next | ESC: Cancel">
        <CardEntry
          label="Enter the front of the card (question):"
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
      <Frame title="Add Card - Back" footer="Type your answer | Enter: Next | ESC: Back">
        <box flexDirection="column" style={{ gap: 1 }}>
          <text>{`Front: ${form.front}`}</text>
          <CardEntry
            label="Enter the back of the card (answer):"
            onSubmit={(value) => {
              if (value.trim()) {
                setForm({ ...form, back: value, step: 3 });
              }
            }}
            placeholder="Paris"
          />
        </box>
      </Frame>
    );
  }

  if (form.step === 3) {
    return (
      <Frame title="Add Card - Select Deck" footer="↑/↓: Navigate | Enter: Save | ESC: Back">
        <box flexDirection="column" style={{ gap: 1 }}>
          <text>{`Front: ${form.front}`}</text>
          <text>{`Back: ${form.back}`}</text>
          <text>Select a deck:</text>

          <DeckSelector
            onSelect={(deckId) => {
              // TODO: Save card to database
              console.log("Save card:", { ...form, deckId });
            }}
          />
        </box>
      </Frame>
    );
  }

  return (
    <Frame title="Add Card">
      <text>Step {form.step}</text>
    </Frame>
  );
}
