import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CliRenderer } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import fs from "fs";
import path from "path";
import clipboardy from "clipboardy";

const LOG_FILE = path.join(process.cwd(), "debug.log");

interface LogContextType {
  logs: string[];
  log: (...args: any[]) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | null>(null);

// Clear log file on module load
fs.writeFileSync(
  LOG_FILE,
  `=== Debug Log Started: ${new Date().toISOString()} ===\n`,
);

export function LogProvider({
  children,
  renderer,
}: {
  children: ReactNode;
  renderer: CliRenderer;
}) {
  const { width, height } = useTerminalDimensions();
  const [logs, setLogs] = useState<string[]>([]);

  const log = (...args: any[]) => {
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
      )
      .join(" ");

    // Write to file for copying
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);

    setLogs((prev) => [...prev.slice(-4), message]); // Keep last 5 logs for in-UI display
  };

  const clearLogs = () => setLogs([]);

  // Add keyboard shortcut for clearing logs (Ctrl+L like clearing terminal)
  useKeyboard((key) => {
    if (key.name === "l" && key.ctrl) {
      clearLogs();
      return true; // Prevent default behavior
    }
  });

  const handleMouseUp = async () => {
    const selection = renderer.getSelection?.();
    const text = selection?.getSelectedText?.();

    if (text && text.length > 0) {
      // OSC 52 escape sequence for terminal clipboard (works over SSH)
      const base64 = Buffer.from(text).toString("base64");
      const osc52 = `\x1b]52;c;${base64}\x07`;
      const finalOsc52 = process.env["TMUX"]
        ? `\x1bPtmux;\x1b${osc52}\x1b\\`
        : osc52;

      // @ts-expect-error - writeOut exists but may not be in types
      renderer.writeOut?.(finalOsc52);

      // Also copy to system clipboard
      await clipboardy.write(text).catch(() => {});

      // Clear selection
      renderer.clearSelection?.();
    }
  };

  return (
    <LogContext.Provider value={{ logs, log, clearLogs }}>
      <box flexDirection="column" width={width} height={height}>
        {/* Compact log display at top */}
        <box
          flexDirection="row"
          onMouseUp={handleMouseUp}
          justifyContent="space-between"
          style={{
            marginBottom: 1
          }}
        >
          <box>
            <text attributes={2}>
              {logs.length === 0 ? "Debug: -" : `Debug: ${logs[logs.length - 1]}`}
            </text>
          </box>
          {logs.length > 0 && (
            <box>
              <text attributes={2}>[Ctrl+L]</text>
            </box>
          )}
        </box>

        {/* Main content */}
        {children}
      </box>
    </LogContext.Provider>
  );
}

export function useLog() {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error("useLog must be used within LogProvider");
  }
  return context;
}
