#!/usr/bin/env python3

"""
Render a Markdown note to PDF when a local browser renderer is available.

Usage:
  python3 scripts/md_to_pdf.py notes/2026-05-16_股癌筆記.md

This script first creates a print-ready HTML file via render_note_html.js. If
Chrome/Chromium is installed, it then asks the browser to print that HTML to PDF.
"""

from __future__ import annotations

import pathlib
import shutil
import subprocess
import sys


def find_browser() -> str | None:
    candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
        shutil.which("google-chrome"),
        shutil.which("chromium"),
        shutil.which("chromium-browser"),
    ]
    return next((str(item) for item in candidates if item and pathlib.Path(item).exists()), None)


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/md_to_pdf.py <note.md> [output.pdf]", file=sys.stderr)
        return 1

    note = pathlib.Path(sys.argv[1]).resolve()
    if not note.exists():
        print(f"Missing input file: {note}", file=sys.stderr)
        return 1

    output_pdf = pathlib.Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else pathlib.Path("rendered") / f"{note.stem}.pdf"
    output_html = output_pdf.with_suffix(".html")
    output_pdf.parent.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        ["node", "scripts/render_note_html.js", str(note), str(output_html)],
        check=True,
    )

    browser = find_browser()
    if not browser:
        print(f"HTML written to {output_html}; Chrome/Chromium not found, skipped PDF.", file=sys.stderr)
        return 2

    subprocess.run(
        [
            browser,
            "--headless",
            "--disable-gpu",
            f"--print-to-pdf={output_pdf}",
            output_html.as_uri(),
        ],
        check=True,
    )
    print(output_pdf)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
