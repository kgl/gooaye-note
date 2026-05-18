# Gooaye Workspace

This folder keeps final Gooaye notes plus reusable helper scripts.

- `notes/` - final 股癌 Markdown notes.
- `rendered/` - beautified standalone HTML files generated from `notes/`.
- `scripts/` - small reusable extraction/rendering utilities.

Intermediate audio, source snapshots, transcript exports, and temporary test
files have been removed. New final notes can go in `notes/`; run
`node scripts/build_all_html.js` to regenerate the HTML files.

HTML output uses Pico CSS from jsDelivr plus one shared stylesheet at
`rendered/assets/gooaye-note.css`, so each generated note does not inline a full
CSS bundle.
