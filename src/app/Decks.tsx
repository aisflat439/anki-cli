import { useQuery } from "@tanstack/react-query";
import { getAllDecks } from "../db/domain/decks";
import { Frame } from "./Frame";

export function Decks() {
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

  return (
    <Frame title="Decks">
      <box style={{ marginTop: 2 }}>
        <text>{`Found ${decks?.length ?? 0} decks`}</text>
      </box>
    </Frame>
  );
}
