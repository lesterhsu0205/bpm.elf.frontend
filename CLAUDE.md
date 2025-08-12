# CLAUDE.md

此檔案為 Claude Code (claude.ai/code) 在此專案中工作時的指導說明。

## 開發指令

### 本地開發
```bash
# 啟動帶有 HTTPS 證書的本地開發伺服器
pnpm run local

# 程式碼檢查
pnpm run lint
```

### 不同環境建置
專案使用多階段建置流程，分別處理 Web Components、Next.js 和伺服器打包：

```bash
# 環境專用建置
pnpm run build:dev.local    # 本地開發環境
pnpm run build:dev          # 開發環境  
pnpm run build:stg          # 測試環境
pnpm run build:uat          # 使用者驗收測試環境
pnpm run build:prod         # 正式環境
```

### Web Component 開發
```bash
# 針對不同環境建置 Web Components
pnpm run webcomponent:dev
pnpm run webcomponent:stg
pnpm run webcomponent:uat
pnpm run webcomponent:prod

# 一般 Web Component 建置（使用 .env.development）
pnpm run build:webcomponent
```

### 正式環境部署
```bash
# 啟動正式環境伺服器（會先建置 Web Component）
pnpm start
```

## 架構概觀

### 多輸出系統
此專案從單一程式碼庫產生三種不同的輸出：

1. **Next.js 應用程式** (`/bpm-elf` basePath) - 主要網頁應用程式
2. **Web Component** (`x-elf-wrapper-modal`) - 可嵌入外部網站的元件
3. **Chrome 擴充功能** - 具有獨立 UI 的瀏覽器擴充功能

### 核心架構模式

**雙重建置系統**：
- Webpack 設定檔處理 Web Component (`webpack.webcomponent.config.js`) 和 Chrome 擴充功能 (`webpack.chrome.component.config.js`) 建置
- Next.js 處理主要應用程式建置
- `build.js` 負責統籌最終打包和部署準備

**環境配置**：
- 針對不同部署環境使用多個 `.env.*` 檔案
- 在建置時透過 webpack DefinePlugin 注入環境變數
- 支援本地開發的 HTTPS 證書

**表單系統架構**：
- 透過 `src/components/content.js` 進行 JSON 驅動的動態表單生成
- 支援單一表單和多票券複合表單
- 表單元素位於 `src/components/formElements/`（text、textarea、select、radio、checkbox、description）
- 使用 lodash 模板處理描述欄位

**Web Component Modal 模式**：
- `src/webComponent.js` 使用 `react-to-webcomponent` 匯出 `ELFWrapperModalContainer`
- 基於 Modal 的 UI，從 `/api/setting/{formName}.json` 取得表單配置
- 智慧快取和重載邏輯以保持表單狀態

**選單系統**：
- 使用 `src/contexts/MenuContext.js` 的複雜多層懸停選單系統
- 管理選單狀態、定位和延遲關閉行為
- 由導航元件如 `chromeNavMegaMenu.js` 使用

### 元件通訊
- 使用 React Hook Form 搭配 FormProvider 進行表單狀態管理
- 透過 Context providers 管理選單狀態和共享應用程式狀態
- Web Components 接收屬性：`applyitem`、`backendurl`、`buttontext`、`buttonclass`

### API 整合
- Next.js 重寫代理 `/api/*` 到後端 (`NEXT_PUBLIC_BACKEND_URL`)
- 表單配置以 JSON 檔案形式從 `/api/setting/{item}.json` 取得
- Chrome 擴充功能透過 `NEXT_PUBLIC_WEB_COMPONENT_URL` 使用相同的 API 端點

## 重要注意事項

**證書處理**：專案需要在 `certs/` 目錄中放置 HTTPS 證書以進行本地開發。使用 `NODE_EXTRA_CA_CERTS` 環境變數載入自訂證書。

**建置依賴關係**：在啟動 Next.js 開發伺服器或正式環境建置之前，必須先建置 Web Components。

**Chrome 擴充功能**：使用 Manifest V3 搭配 service worker 背景腳本。擴充功能檔案會單獨建置並放置在 `bpm_elf_extension/` 目錄中。

**表單配置**：系統預期 JSON 配置檔案採用單一表單格式或包含 `tickets` 陣列的多票券格式。

**樣式設定**：使用 Bootstrap 5 + Tailwind CSS + Material Tailwind 組合。Web Component 樣式透過 `webcomponent.css` 進行隔離。

## Git 工作流程
合併分支時，使用 `git merge --no-ff` 以保留分支歷史並建立清楚的合併提交。
