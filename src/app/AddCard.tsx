export function AddCard() {
  return (
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <box flexDirection="column" style={{ padding: 2 }}>
        <text>Add Card View</text>
        <text attributes={1} style={{ marginTop: 1 }}>
          ESC: Back to Menu
        </text>
      </box>
    </box>
  );
}
