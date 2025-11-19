import type { Config } from "drizzle-kit";
import { homedir } from "os";
import { join } from "path";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: join(homedir(), ".anki-cli", "anki.db"),
  },
} satisfies Config;
