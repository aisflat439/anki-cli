import { Frame } from "./Frame";
import { useNavigate } from "./Router";
import { DeckSelector } from "../components/DeckSelector";

export function Decks() {
  const navigate = useNavigate();

  return (
    <Frame title="Decks" footer="↑/↓: Navigate | Enter: Select | ESC: Back">
      <DeckSelector
        onSelect={(deckId) => {
          navigate("deck-detail", { deckId });
        }}
      />
    </Frame>
  );
}
