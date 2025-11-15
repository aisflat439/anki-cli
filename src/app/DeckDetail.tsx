import { Frame } from "./Frame";

type DeckDetailProps = {
  deckId: number;
};

export function DeckDetail({ deckId }: DeckDetailProps) {
  return (
    <Frame title={`Deck ${deckId}`}>
      <text>Hello DeckDetail</text>
    </Frame>
  );
}
