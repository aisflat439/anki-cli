#!/usr/bin/env bun
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App } from "./app";

const cli = yargs(hideBin(process.argv))
  .scriptName("anki")
  .version("0.1.0")
  .alias("version", "v")
  .help("help")
  .alias("help", "h")
  .strict();

await cli.parse();

const renderer = await createCliRenderer({
  useAlternateScreen: true,
  exitOnCtrlC: true,
});

// Cleanup on exit
process.on("SIGINT", () => {
  renderer.stop();
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  renderer.stop();
  console.error("Uncaught exception:", error);
  process.exit(1);
});

createRoot(renderer).render(<App renderer={renderer} />);
