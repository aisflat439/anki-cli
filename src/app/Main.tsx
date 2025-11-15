import type { SelectOption } from "@opentui/core";
import { Frame } from "./Frame";

type MainProps = {
  onSelect: (index: number, option: SelectOption | null) => void;
};

export function Main({ onSelect }: MainProps) {
  const menuOptions: SelectOption[] = [
    { name: "Study", description: "Review flashcards", value: "study" },
    { name: "Stats", description: "View your progress", value: "stats" },
    {
      name: "Add Card",
      description: "Create a new flashcard",
      value: "add-card",
    },
    { name: "Add Deck", description: "Create a new deck", value: "add-deck" },
  ];

  return (
    <Frame title="Main Menu" footer="↑/↓: Navigate | Enter: Select | ESC: Quit">
      <box style={{ border: true, height: 10 }}>
        <select
          options={menuOptions}
          focused={true}
          showDescription={true}
          onSelect={onSelect}
          style={{ height: 8 }}
        />
      </box>
    </Frame>
  );
}
