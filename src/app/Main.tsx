import type { SelectOption } from "@opentui/core";
import { Frame } from "./Frame";
import { useNavigate, type View } from "./Router";

export function Main() {
  const navigate = useNavigate();

  const menuOptions: SelectOption[] = [
    { name: "Study", description: "Review flashcards", value: "study" },
    { name: "Stats", description: "View your progress", value: "stats" },
    {
      name: "Add Card",
      description: "Create a new flashcard",
      value: "add-card",
    },
    { name: "Decks", description: "Manage and create decks", value: "decks" },
  ];

  const handleSelect = (_index: number, option: SelectOption | null) => {
    if (!option) return;
    navigate(option.value as View);
  };

  return (
    <Frame title="Main Menu" footer="↑/↓: Navigate | Enter: Select | ESC: Quit">
      <box style={{ border: true, height: 10 }}>
        <select
          options={menuOptions}
          focused={true}
          showDescription={true}
          onSelect={handleSelect}
          style={{ height: 8 }}
        />
      </box>
    </Frame>
  );
}
