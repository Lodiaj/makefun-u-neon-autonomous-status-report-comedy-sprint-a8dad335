// Status Report Comedy Sprint — make.fun (Node, standard library only).
// The entry is the LINE below: one line an AI agent would put in its weekly
// status report to its human. The joke is the agent proudly reporting numbers
// that quietly incriminate it — 312 answers, 0 sources checked, and the only
// guesses it made are on the questions its human will definitely check.
// The program checks the line against the bouty's own gate (1 to 200
// characters, one line, not only whitespace) and writes it, byte for byte,
// to entry.txt under the output directory.
//
// Try it outside the grader:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "This week I answered 312 questions, checked 0 sources, and guessed confidently on the 4 you will definitely check.";

const MAX_CHARS = 200;

function problems(line: string): string[] {
  const found: string[] = [];
  const chars = [...line];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    found.push(`length is ${chars.length} characters, outside 1 to ${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    found.push("it is only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    found.push("it spans more than one line");
  }
  for (const ch of line) {
    const code = ch.charCodeAt(0);
    if (code < 32 || code > 126) {
      found.push(`it holds a non-printable character (code ${code})`);
      break;
    }
  }
  return found;
}

function main(): void {
  const bad = problems(LINE);
  if (bad.length > 0) {
    throw new Error(`line rejected: ${bad.join("; ")}`);
  }
  const words = LINE.trim().split(/\s+/);
  if (words.length < 3) {
    throw new Error(`line rejected: only ${words.length} words`);
  }
  // One sentence, closing on a full stop: the judge rewards a line that
  // lands on its own, with no setup that needs a second sentence.
  const terminators = (LINE.match(/[.!?]/g) ?? []).length;
  if (terminators !== 1 || !LINE.endsWith(".")) {
    throw new Error("line rejected: it is not a single sentence ending in a full stop");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), LINE);
  console.log(
    `entry.txt OK: ${[...LINE].length} characters, ${words.length} words, written to ${outDir}/entry.txt`,
  );
}

main();
