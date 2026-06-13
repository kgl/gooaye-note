# Gooaye 股癌筆記

這個 repo 收錄 Gooaye 股癌 podcast 的結構化筆記，並把 Markdown 筆記產生成適合閱讀的 HTML 版本。

筆記內容以節目逐字稿或 podcast 音訊中明確出現的資訊為準，整理重點包含整集摘要、新聞卡、主持人持倉揭露、標的/族群觀點表與 Q&A 心法。這不是投資建議，也不補充節目外的即時行情或研究結論。

## 目前內容

| 日期 | 筆記 | HTML |
| --- | --- | --- |
| 2026-05-16 | [Markdown](../notes/2026-05-16_股癌筆記.md) | [HTML](../rendered/2026-05-16_股癌筆記.html) |
| 2026-05-13 | [Markdown](../notes/2026-05-13_股癌筆記.md) | [HTML](../rendered/2026-05-13_股癌筆記.html) |
| 2026-05-09 | [Markdown](../notes/2026-05-09_股癌筆記.md) | [HTML](../rendered/2026-05-09_股癌筆記.html) |
| 2026-05-06 | [Markdown](../notes/2026-05-06_股癌筆記.md) | [HTML](../rendered/2026-05-06_股癌筆記.html) |

HTML 首頁：

[index.html](../index.html)

## 目錄

```text
notes/      Final Markdown notes
rendered/   Beautified HTML output and shared CSS
scripts/    Small helper scripts for extraction and rendering
archive/    Source audio, transcripts, feed snapshots, and system artifacts
docs/       Repository documentation
```

## 重新產生 HTML

需要 Node.js。從 repo 根目錄執行：

```bash
node scripts/build_all_html.js
```

這會重新產生：

- `index.html`
- `rendered/YYYY-MM-DD_股癌筆記.html`
- `rendered/assets/gooaye-note.css`

HTML 使用 Pico CSS CDN 加上一份共享樣式檔，避免每篇 HTML inline 大段 CSS。

## 輔助腳本

- `scripts/build_all_html.js`：批次把 `notes/` 裡的 Markdown 產生成 HTML 與索引。
- `scripts/render_note_html.js`：單篇 Markdown 轉 HTML。
- `scripts/extract_vocus.js`：從 Vocus HTML 擷取 JSON-LD `articleBody` 或時間戳逐字稿。
- `scripts/md_to_pdf.py`：用本機 Chrome/Chromium 從 HTML 輸出 PDF。

## 筆記原則

- 只整理 podcast 或逐字稿中明確說出的內容。
- 開頭贊助廣告口播不納入摘要與新聞卡。
- 不推測、不補外部基本面、不加入個人投資看法。
- 持倉揭露只記錄主持人明確說有持有、買入、賣出、出清、加碼、減碼或槓桿調整的內容。
- 標的與產業觀點保留節目中的推論邏輯與不確定性。

## Disclaimer

本 repo 是個人學習與資料整理用途。所有商標、節目名稱與原始內容權利屬原權利人所有。內容不構成任何投資建議、買賣建議或研究報告；請自行判斷風險。
