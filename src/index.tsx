#!/usr/bin/env bun
import { TextAttributes, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { getAllDecks } from "./db/domain/decks";
import { useState, useEffect } from "react";

function App() {
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDecks()
      .then((data) => {
        setDecks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load decks:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <box alignItems="center" justifyContent="center" flexGrow={1}>
        <text>Loading decks...</text>
      </box>
    );
  }

  return (
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <box
        title="Anki CLI - Decks"
        justifyContent="center"
        alignItems="flex-start"
      >
        {decks.length === 0 ? (
          <text attributes={TextAttributes.DIM}>
            No decks found. Run: bun db:seed
          </text>
        ) : (
          decks.map((deck) => (
            <box key={deck.id}>
              <text>{deck.name}</text>
              {deck.description && (
                <text attributes={TextAttributes.DIM}>
                  {" "}
                  - {deck.description}
                </text>
              )}
            </box>
          ))
        )}
      </box>
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
