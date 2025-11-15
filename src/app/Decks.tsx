import { useQuery } from "@tanstack/react-query";
import { getAllDecks } from "../db/domain/decks";

export function Decks() {
  const { data: decks, isLoading } = useQuery({
    queryKey: ["decks"],
    queryFn: getAllDecks,
  });

  if (isLoading) {
    return (
      <box alignItems="center" justifyContent="center" flexGrow={1}>
        <text>Loading decks...</text>
      </box>
    );
  }

  return (
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <box flexDirection="column" style={{ padding: 2 }}>
        <text>Decks</text>
        <text attributes={1} style={{ marginTop: 1 }}>
          ESC: Back to Menu
        </text>
        
        <box style={{ marginTop: 2 }}>
          <text>{`Found ${decks?.length ?? 0} decks`}</text>
        </box>
      </box>
    </box>
  );
}
