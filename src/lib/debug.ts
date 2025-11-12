import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "debug.log");

// Clear log file on startup
fs.writeFileSync(LOG_FILE, `=== Anki CLI Debug Log - ${new Date().toISOString()} ===\n`);

export function debug(...args: any[]) {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(LOG_FILE, logLine);
}

export function getLogFilePath() {
  return LOG_FILE;
}
