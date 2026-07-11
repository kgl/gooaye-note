# 股癌筆記維護指南

專案介紹與公開網站入口請見根目錄的 [README.md](../README.md)。本文件專注於新增筆記、重建 HTML 與發布前檢查。

## 新增一期筆記

1. 在 `notes/` 新增 `YYYY-MM-DD_股癌筆記.md`。
2. 依固定章節完成摘要、新聞、持倉揭露、標的觀點、Q&A 與資料來源。
3. 從專案根目錄執行 `node scripts/build_all_html.js`。
4. 確認新的 HTML 已出現在 `rendered/`，且 `index.html` 將最新日期排在最前面。
5. 提交 Markdown、單集 HTML、`index.html`，以及確實需要更新的共用資產或來源快照。

## Markdown 結構

每篇正式筆記依下列順序撰寫：

```text
# YYYY-MM-DD 股癌筆記

- 節目
- 標題
- 發布日期
- 長度
- 主要資料來源
- Apple Podcasts
- SoundOn
- 逐字稿來源
- 範圍說明

## 整集摘要 summary
## 今日新聞整理 news
## 主持人持倉揭露 hostDisclosure
## 主題/標的觀點表 stockAnalysis
## Q&A 心法 qa
## 資料來源
```

新聞卡應包含 `category`、`sourceRef`、`event` 與 `opinion`。持倉揭露應包含 `sourceRef`、`disclosure` 與 `context`。所有段落都應保留可回聽的時間戳。

## 產生 HTML

批次重建所有筆記與索引：

```bash
node scripts/build_all_html.js
```

只產生單篇 HTML：

```bash
node scripts/render_note_html.js notes/YYYY-MM-DD_股癌筆記.md rendered/YYYY-MM-DD_股癌筆記.html
```

HTML 使用 Pico CSS CDN 與 `rendered/assets/gooaye-note.css`。不要把大型 CSS bundle 重複內嵌到每篇頁面。

## 產生 PDF

PDF 工具需要本機 Chrome 或 Chromium，並遵循專案的 uv Python 規則：

```bash
uv run python scripts/md_to_pdf.py notes/YYYY-MM-DD_股癌筆記.md
```

若找不到瀏覽器，工具仍會留下中間 HTML，但不會產生 PDF。

## 輔助工具

- `scripts/build_all_html.js`：批次產生所有 HTML、共用樣式與首頁索引。
- `scripts/render_note_html.js`：將單篇 Markdown 轉為 HTML。
- `scripts/extract_vocus.js`：優先從 Vocus HTML 的 JSON-LD `articleBody` 擷取逐字稿。
- `scripts/extract_podwise_transcript.js`：擷取 Podwise 匯出的逐字稿內容。
- `scripts/md_to_pdf.py`：透過本機瀏覽器輸出 PDF。

## 發布前檢查

- 最新一集的日期、集數、時間長度與來源網址一致。
- 逐字稿最後時間戳接近節目完整長度。
- 開場贊助口播未被整理成新聞卡。
- 所有持倉狀態都來自主持人明確說法，沒有把聽眾推測當成事實。
- 專有名詞已核對，無法確認者保留不確定標記。
- `node scripts/build_all_html.js` 執行成功。
- 新筆記在 `index.html` 排序正確，公開 HTML 的章節與表格可正常閱讀。

## GitHub Pages

公開網站由 `main` 分支根目錄發布：

<https://kgl.github.io/gooaye-note/>

PR 合併後，應等待 Pages 部署狀態完成，再直接開啟新單集網址確認內容已更新。
