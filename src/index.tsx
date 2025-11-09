import { TextAttributes, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";

function App() {
  return (
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <box title="derp" justifyContent="center" alignItems="flex-end">
        <ascii-font font="tiny" text="OpenTUI" />
        <text attributes={TextAttributes.DIM}>build these nuts?</text>
      </box>
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
