#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const notesDir = "notes";
const outputDir = "rendered";
const assetsDir = path.join(outputDir, "assets");
const renderer = path.join("scripts", "render_note_html.js");
const noteCss = path.join("scripts", "assets", "gooaye-note.css");

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readTitle(markdown, fallback) {
  const firstHeading = markdown.match(/^#\s+(.+)$/m);
  const episode = markdown.match(/^- 節目：(.+)$/m);
  return (episode && episode[1]) || (firstHeading && firstHeading[1]) || fallback;
}

function readDate(markdown, fallback) {
  const date = markdown.match(/^- 發布日期：(.+)$/m);
  const value = (date && date[1]) || fallback;
  const shortDate = value.match(/\d{4}-\d{2}-\d{2}/);
  return shortDate ? shortDate[0] : value;
}

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });
fs.copyFileSync(noteCss, path.join(assetsDir, "gooaye-note.css"));

const notes = fs
  .readdirSync(notesDir)
  .filter((name) => name.endsWith(".md"))
  .sort()
  .map((name) => {
    const source = path.join(notesDir, name);
    const output = path.join(outputDir, `${path.basename(name, ".md")}.html`);
    const rendered = spawnSync("node", [renderer, source, output], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (rendered.status !== 0) {
      process.stderr.write(rendered.stderr);
      process.exit(rendered.status || 1);
    }
    const markdown = fs.readFileSync(source, "utf8");
    return {
      source,
      output,
      title: readTitle(markdown, path.basename(name, ".md")),
      date: readDate(markdown, path.basename(name, ".md").slice(0, 10)),
    };
  });

const cards = notes
  .slice()
  .reverse()
  .map(
    (note) => `<a class="card" href="${escapeHtml(note.output)}">
      <span class="date">${escapeHtml(note.date)}</span>
      <strong>${escapeHtml(note.title)}</strong>
      <span class="path">${escapeHtml(note.source)}</span>
    </a>`
  )
  .join("\n");

const index = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gooaye 股癌筆記索引</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2.1.1/css/pico.min.css">
  <link rel="stylesheet" href="rendered/assets/gooaye-note.css">
</head>
<body>
  <main class="index">
    <section class="hero">
      <p class="kicker">Gooaye 股癌 Podcast Notes</p>
      <h1>股癌筆記索引</h1>
      <p class="sub">所有正式 Markdown 筆記的美化 HTML 版本。最新集數排在前面。</p>
    </section>
    <section class="grid" aria-label="筆記列表">
${cards}
    </section>
  </main>
</body>
</html>
`;

fs.writeFileSync("index.html", index);
console.log(`Rendered ${notes.length} notes to ${outputDir}/`);
