#!/usr/bin/env node

const fs = require("fs");

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/extract_podwise_transcript.js <html> <output.md>");
  process.exit(1);
}

const html = fs.readFileSync(inputPath, "utf8");
const marker = '\\"transcripts\\":[';
const markerIndex = html.indexOf(marker);

if (markerIndex === -1) {
  throw new Error("Could not find Podwise transcript data");
}

const arrayStart = markerIndex + marker.length - 1;
let inString = false;
let escaped = false;
let depth = 0;
let arrayEnd = -1;

for (let index = arrayStart; index < html.length; index += 1) {
  const char = html[index];

  if (escaped) {
    escaped = false;
    continue;
  }

  if (char === "\\") {
    escaped = true;
    continue;
  }

  if (char === '"') {
    inString = !inString;
    continue;
  }

  if (inString) continue;

  if (char === "[") depth += 1;
  if (char === "]") {
    depth -= 1;
    if (depth === 0) {
      arrayEnd = index + 1;
      break;
    }
  }
}

if (arrayEnd === -1) {
  throw new Error("Could not find end of Podwise transcript data");
}

const escapedJson = html.slice(arrayStart, arrayEnd);
const json = JSON.parse(`"${escapedJson}"`);
const transcripts = JSON.parse(json);
const markdown = transcripts
  .map(({ time, content, speaker }) => `[${time}] ${speaker}: ${content}`)
  .join("\n\n");

fs.writeFileSync(outputPath, `${markdown}\n`);
console.log(`Extracted ${transcripts.length} segments to ${outputPath}`);
console.log(`Last segment: ${transcripts.at(-1).time}`);
