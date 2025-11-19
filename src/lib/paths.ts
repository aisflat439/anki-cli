import { homedir } from "os";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

/**
 * Get the user's data directory for anki-cli.
 * Creates the directory if it doesn't exist.
 * 
 * Location:
 * - macOS/Linux: ~/.anki-cli/
 * - Windows: %USERPROFILE%\.anki-cli\
 */
export function getDataDir(): string {
  const dataDir = join(homedir(), ".anki-cli");
  
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  
  return dataDir;
}

/**
 * Get the full path to the database file.
 * Creates the data directory if it doesn't exist.
 */
export function getDbPath(): string {
  return join(getDataDir(), "anki.db");
}
