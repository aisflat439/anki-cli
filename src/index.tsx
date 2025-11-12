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

// Disable alternate screen so all text is copyable
const renderer = await createCliRenderer({
  useAlternateScreen: false,
});
createRoot(renderer).render(<App renderer={renderer} />);
