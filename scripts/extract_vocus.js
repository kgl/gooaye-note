#!/usr/bin/env node

const fs = require("fs");

function usage() {
  console.error("Usage: node scripts/extract_vocus.js <vocus-html-file>");
  process.exit(1);
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function stripHtml(value) {
  return decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractJsonLdArticleBody(html) {
  const blocks = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  if (!blocks) return "";

  for (const block of blocks) {
    const raw = block
      .replace(/^<script[^>]*>/i, "")
      .replace(/<\/script>$/i, "")
      .trim();
    try {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item && typeof item.articleBody === "string") {
          return item.articleBody.trim();
        }
      }
    } catch {
      // Try the next JSON-LD block.
    }
  }
  return "";
}

const file = process.argv[2];
if (!file) usage();

const html = fs.readFileSync(file, "utf8");
const articleBody = extractJsonLdArticleBody(html);
const timestampLines = stripHtml(html)
  .split(/\n/)
  .map((line) => line.trim())
  .filter((line) => /^\[?\d{1,2}:\d{2}(?::\d{2})?\]?/.test(line));

if (articleBody) {
  console.log(articleBody);
} else if (timestampLines.length) {
  console.log(timestampLines.join("\n"));
} else {
  console.log(stripHtml(html));
}
