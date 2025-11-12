import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface LogContextType {
  logs: string[];
  log: (...args: any[]) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | null>(null);

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<string[]>([]);

  const log = (...args: any[]) => {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    setLogs(prev => [...prev.slice(-4), message]); // Keep last 5 logs
  };

  const clearLogs = () => setLogs([]);

  return (
    <LogContext.Provider value={{ logs, log, clearLogs }}>
      <box flexDirection="column" flexGrow={1}>
        {/* Log display at top */}
        <box 
          flexDirection="column" 
          style={{ 
            border: true,
            paddingBottom: 1,
            marginBottom: 1,
            minHeight: 6
          }}
        >
          <text style={{ marginBottom: 1 }} attributes={2}>Debug Logs:</text>
          {logs.length === 0 ? (
            <text attributes={1}>No logs yet...</text>
          ) : (
            logs.map((log, i) => (
              <text key={i} attributes={1}>{log}</text>
            ))
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
