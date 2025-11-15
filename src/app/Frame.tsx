import type { ReactNode } from "react";

type FrameProps = {
  title: string;
  children: ReactNode;
  footer?: string;
};

export function Frame({ title, children, footer = "ESC: Back to Menu" }: FrameProps) {
  return (
    <box flexDirection="column" flexGrow={1} style={{ padding: 2 }}>
      {/* Title at top-left */}
      <box>
        <text>{`Anki CLI - ${title}`}</text>
      </box>
      
      {/* Content fills the middle */}
      <box flexGrow={1} style={{ marginTop: 1 }}>
        {children}
      </box>
      
      {/* Footer at bottom-left */}
      <box>
        <text attributes={1}>{footer}</text>
      </box>
    </box>
  );
}
