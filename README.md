# Gooaye 股癌筆記

將 Gooaye 股癌 Podcast 整理成可搜尋、可回顧的繁體中文結構化筆記。

每篇筆記均以節目音訊或完整逐字稿為依據，保留主持人的市場判斷、持倉揭露與推論脈絡，不補入節目之外的行情、研究結論或投資建議。

## 快速入口

- [瀏覽全部股癌筆記](https://kgl.github.io/gooaye-note/)
- [最新一期：EP677｜2026-07-08](https://kgl.github.io/gooaye-note/rendered/2026-07-08_%E8%82%A1%E7%99%8C%E7%AD%86%E8%A8%98.html)
- [查看最新 Markdown 原稿](notes/2026-07-08_股癌筆記.md)
- [Apple Podcasts 節目頁](https://podcasts.apple.com/tw/podcast/gooaye-%E8%82%A1%E7%99%8C/id1500839292)

> GitHub Pages 由 `main` 分支根目錄發布。新筆記合併後，通常數分鐘內會出現在公開網站。

## 筆記收錄內容

每一期依固定結構整理：

1. **整集摘要**：依節目討論順序保留完整推論脈絡。
2. **今日新聞整理**：逐題記錄事件、主持人看法與時間戳。
3. **主持人持倉揭露**：只收錄明確提到的持有、買賣、部位或槓桿變化。
4. **主題／標的觀點表**：整理族群、情緒、持倉狀態、風險與分析。
5. **Q&A 心法**：完整保留聽眾問題、回答重點與核心觀念。
6. **資料來源**：附上 Apple Podcasts、SoundOn 與逐字稿來源。

開場贊助口播不會納入摘要或新聞卡。遇到無法確認的公司、產品或人名時，會保留不確定標記，不以猜測補正。

## 專案結構

```text
notes/       正式 Markdown 筆記
rendered/    對應的美化 HTML 與共用樣式
scripts/     逐字稿擷取、HTML 產生與 PDF 輔助工具
archive/     RSS、逐字稿及本機來源資料
docs/        維護與產製流程說明
index.html   GitHub Pages 筆記首頁
```

## 重新產生網站

HTML 產生器只使用 Node.js 內建模組，不需要額外安裝套件。從專案根目錄執行：

```bash
node scripts/build_all_html.js
```

這個命令會更新：

- `index.html`
- `rendered/YYYY-MM-DD_股癌筆記.html`
- `rendered/assets/gooaye-note.css`

如需只產生單篇 HTML：

```bash
node scripts/render_note_html.js notes/YYYY-MM-DD_股癌筆記.md rendered/YYYY-MM-DD_股癌筆記.html
```

完整維護方式請見 [docs/README.md](docs/README.md)。

## 資料原則

- 只整理節目中明確出現的內容。
- 數字、價格、比率、估值與部位資訊均保留原始時間點語境。
- 不把主持人隨口提及的標的誤寫成持股或推薦。
- 不用外部市場資訊改寫主持人的原始觀點。
- 專有名詞優先以官方或高可信來源核對；無法確認時明確標示。
- 公開筆記不是逐字稿替代品，重要決策請回聽原始節目。

## 免責聲明

本專案僅供個人學習、資料整理與內容索引使用，與 Gooaye 股癌及其製作團隊沒有隸屬或合作關係。節目名稱、商標與原始內容權利屬原權利人所有。

筆記不構成投資建議、買賣建議、研究報告或任何形式的報酬保證。投資人應自行查證資訊並承擔決策風險。
