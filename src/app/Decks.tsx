import { useQuery } from "@tanstack/react-query";
import { getAllDecks } from "../db/domain/decks";
import { Frame } from "./Frame";
import { useNavigate } from "./Router";
import type { SelectOption } from "@opentui/core";

export function Decks() {
  const navigate = useNavigate();
  const { data: decks, isLoading } = useQuery({
    queryKey: ["decks"],
    queryFn: getAllDecks,
  });

  if (isLoading) {
    return (
      <Frame title="Decks">
        <text>Loading decks...</text>
      </Frame>
    );
  }

  const deckOptions: SelectOption[] =
    decks?.map((deck) => ({
      name: deck.name,
      description: deck.description || "",
      value: deck.id.toString(),
    })) || [];

  return (
    <Frame title="Decks" footer="↑/↓: Navigate | Enter: Select | ESC: Back">
      <box style={{ border: true, height: 10 }}>
        <select
          options={deckOptions}
          focused={true}
          showDescription={true}
          onSelect={(_index, option) => {
            if (option) {
              navigate("deck-detail", { deckId: parseInt(option.value) });
            }
          }}
          style={{ height: 8 }}
        />
      </box>
    </Frame>
  );
}
