import { useQuery } from "@tanstack/react-query";
import { getAllDecks } from "../db/domain/decks";
import type { SelectOption } from "@opentui/core";

type DeckSelectorProps = {
  /** Callback when a deck is selected */
  onSelect: (deckId: number) => void;
  /** Whether the selector should be focused */
  focused?: boolean;
};

/**
 * Reusable deck selector component that fetches and displays all decks
 */
export function DeckSelector({ onSelect, focused = true }: DeckSelectorProps) {
  const { data: decks, isLoading } = useQuery({
    queryKey: ["decks"],
    queryFn: getAllDecks,
  });

  if (isLoading) {
    return <text>Loading decks...</text>;
  }

  const deckOptions: SelectOption[] =
    decks?.map((deck) => ({
      name: deck.name,
      description: deck.description || "",
      value: deck.id.toString(),
    })) || [];

  return (
    <box style={{ border: true, height: 10 }}>
      <select
        options={deckOptions}
        focused={focused}
        showDescription={true}
        onSelect={(_index, option) => {
          if (option) {
            onSelect(parseInt(option.value));
          }
        }}
        style={{ height: 8 }}
      />
    </box>
  );
}
