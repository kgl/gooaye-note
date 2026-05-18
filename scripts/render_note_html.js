#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function usage() {
  console.error("Usage: node scripts/render_note_html.js <note.md> [output.html]");
  process.exit(1);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/&lt;(https?:\/\/[^&\s]+)&gt;/g, '<a href="$1">$1</a>');
}

function slugify(value) {
  const ascii = value
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return ascii || `section-${Math.random().toString(36).slice(2, 8)}`;
}

function renderTable(lines) {
  const rows = lines.map((line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => inlineMarkdown(cell.trim()))
  );
  const header = rows[0] || [];
  const body = rows.slice(2);
  return [
    '<div class="table-wrap">',
    "<table>",
    "<thead><tr>",
    ...header.map((cell) => `<th>${cell}</th>`),
    "</tr></thead>",
    "<tbody>",
    ...body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`),
    "</tbody>",
    "</table>",
    "</div>",
  ].join("");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listOpen = false;
  const headings = [];

  function closeList() {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) {
      closeList();
      continue;
    }

    if (/^\|.+\|$/.test(line) && /^\|?\s*:?-{3,}/.test(lines[i + 1] || "")) {
      closeList();
      const tableLines = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && /^\|.+\|$/.test(lines[i])) {
        tableLines.push(lines[i]);
        i += 1;
      }
      i -= 1;
      html.push(renderTable(tableLines));
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      closeList();
      const level = heading[1].length;
      const id = slugify(heading[2]);
      headings.push({ level, text: heading[2], id });
      html.push(`<h${level} id="${id}">${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = /^-\s+(.+)$/.exec(line);
    if (bullet) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  return { body: html.join("\n"), headings };
}

function readMeta(markdown, title) {
  const meta = { title, date: "", duration: "", source: "" };
  const lines = markdown.split(/\r?\n/).slice(0, 12);
  for (const line of lines) {
    const clean = line.replace(/^-\s*/, "");
    if (clean.startsWith("節目：")) meta.title = clean.replace("節目：", "").trim();
    if (clean.startsWith("發布日期：")) meta.date = clean.replace("發布日期：", "").trim();
    if (clean.startsWith("長度：")) meta.duration = clean.replace("長度：", "").trim();
    if (clean.startsWith("主要資料來源：")) meta.source = clean.replace("主要資料來源：", "").trim();
  }
  return meta;
}

const input = process.argv[2];
if (!input) usage();

const output =
  process.argv[3] ||
  path.join("rendered", `${path.basename(input, path.extname(input))}.html`);
const markdown = fs.readFileSync(input, "utf8");
const title = path.basename(input, path.extname(input));
const { body, headings } = markdownToHtml(markdown);
const meta = readMeta(markdown, title);
const toc = headings
  .filter((heading) => heading.level === 2)
  .map((heading) => `<a href="#${heading.id}">${inlineMarkdown(heading.text)}</a>`)
  .join("\n");

const document = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2.1.1/css/pico.min.css">
  <link rel="stylesheet" href="assets/gooaye-note.css">
</head>
<body>
  <div class="shell">
    <header class="hero">
      <p class="kicker">Gooaye 股癌 Podcast Notes</p>
      <h1>${inlineMarkdown(meta.title)}</h1>
      <div class="meta-grid">
        <div class="meta-card"><span class="meta-label">發布日期</span><span class="meta-value">${inlineMarkdown(meta.date || "未標示")}</span></div>
        <div class="meta-card"><span class="meta-label">長度</span><span class="meta-value">${inlineMarkdown(meta.duration || "未標示")}</span></div>
        <div class="meta-card"><span class="meta-label">資料來源</span><span class="meta-value">${inlineMarkdown(meta.source || "Podcast / transcript")}</span></div>
      </div>
    </header>
    <div class="layout">
      <nav class="toc" aria-label="章節目錄">
        <p class="toc-title">Sections</p>
${toc || '<a href="#top">完整筆記</a>'}
      </nav>
      <main class="article" id="top">
${body}
      </main>
    </div>
  </div>
</body>
</html>
`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, document);
console.log(output);
