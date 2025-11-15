type CardEntryProps = {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder: string;
  focused?: boolean;
};

export function CardEntry({
  label,
  value,
  onChange,
  onSubmit,
  placeholder,
  focused = true,
}: CardEntryProps) {
  return (
    <box flexDirection="column" style={{ gap: 1 }}>
      <text>{label}</text>

      <box style={{ border: true, padding: 1 }}>
        <input
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          focused={focused}
          placeholder={placeholder}
        />
      </box>
    </box>
  );
}
