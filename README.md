# BPM ELF 開單小幫手

一個基於 React 和 Next.js 的業務流程管理（BPM）前端應用程式，提供動態表單生成和 Chrome 瀏覽器擴充功能支援。

## 專案概述

BPM ELF 開單小幫手是一個企業級的表單管理系統，支援：
- 動態表單配置與生成
- Web Component 整合
- Chrome 擴充功能支援
- 多環境部署配置

## 主要功能

### 🔧 核心功能
- **動態表單生成**：基於 JSON 配置自動生成表單介面
- **Web Component**：可嵌入任何網頁的獨立組件
- **Chrome 擴充功能**：瀏覽器原生整合支援
- **多層選單系統**：支援複雜的導航結構

### 📋 表單元素
- 文字輸入框 (text.js)
- 文字區域 (textArea.js) 
- 單選按鈕 (radio.js)
- 複選框 (checkbox.js)
- 下拉選單 (select.js)
- 描述文字 (description.js)

### 🎨 UI 組件
- 響應式佈局系統
- Bootstrap 5 整合
- Tailwind CSS 樣式
- Material Tailwind 元件庫
- React Toastify 通知系統

## 技術架構

### 前端技術棧
- **框架**：React 18.3.1 + Next.js 14.1.4
- **樣式**：Tailwind CSS + Bootstrap 5 + Material Tailwind
- **狀態管理**：React Hook Form + Context API
- **建構工具**：Webpack 5 + Babel
- **字體**：Inter + Noto Sans TC

### 專案結構
```
src/
├── components/          # React 組件
│   ├── formElements/   # 表單元素組件
│   ├── chromeNavMegaMenu.js
│   └── ...
├── contexts/           # React Context
├── pages/             # Next.js 頁面
├── styles/            # 樣式檔案
├── utils/             # 工具函數
├── webComponent.js    # Web Component 主檔案
└── chromeComponent.js # Chrome 擴充功能組件

bpm_elf_extension/     # Chrome 擴充功能檔案
├── manifest.json
├── background.js
└── ...
```

## 環境設定與安裝

### 系統需求
- Node.js 18+
- pnpm 套件管理器

### 安裝依賴
```bash
pnpm install
```

### 環境配置
建立對應的環境變數檔案：
- `.env.dev.local` - 本地開發環境
- `.env.dev` - 開發環境
- `.env.stg` - 測試環境
- `.env.uat` - 使用者驗收測試環境
- `.env.prod` - 正式環境

## 開發指令

### 本地開發
```bash
# 啟動本地開發伺服器（含憑證）
pnpm run local
```

### 建構指令
```bash
# 建構各環境版本
pnpm run build:dev.local    # 本地開發版本
pnpm run build:dev          # 開發版本
pnpm run build:stg          # 測試版本
pnpm run build:uat          # UAT 版本
pnpm run build:prod         # 正式版本
```

### Web Component 建構
```bash
# 建構 Web Component
pnpm run build:webcomponent

# 各環境 Web Component 建構
pnpm run webcomponent:dev
pnpm run webcomponent:stg
pnpm run webcomponent:uat
pnpm run webcomponent:prod
```

### 程式碼品質
```bash
# ESLint 檢查
pnpm run lint
```

## 部署說明

### 生產環境啟動
```bash
pnpm start
```

### 建構流程
1. **Web Component 建構**：編譯獨立的 Web Component
2. **Next.js 建構**：生成靜態網站檔案
3. **伺服器建構**：打包伺服器相關檔案

### 憑證管理
專案包含 HTTPS 憑證支援：
- 憑證位置：`certs/` 目錄
- 自動載入 CA 憑證
- 支援本地 HTTPS 開發

## Web Component 使用

### 基本用法
```html
<!-- Modal 模式（推薦） -->
<x-elf-wrapper-modal 
  applyitem="your-form-config"
  backendurl="https://your-backend-url"
  buttontext="開啟表單"
  buttonclass="btn btn-primary">
</x-elf-wrapper-modal>
```

### 參數說明
- `applyitem`: 表單配置項目名稱
- `backendurl`: 後端 API 網址
- `buttontext`: 觸發按鈕文字（預設：開啟頁面）
- `buttonclass`: 按鈕 CSS 類別（預設：btn btn-primary）

## Chrome 擴充功能

詳細安裝和使用說明請參考 [README-chrome-extension.md](README-chrome-extension.md)。

## API 整合

### 表單配置 API
```
GET /api/setting/{formName}.json
```
返回指定表單的 JSON 配置檔案。

### 配置格式
表單配置採用 JSON 格式，支援多種表單元素和驗證規則。

## 開發注意事項

### 安全性
- 使用 Content Security Policy (CSP)
- 避免在程式碼中暴露敏感資訊
- 支援 HTTPS 開發環境

### 效能最佳化
- Web Component 獨立打包
- 按需載入組件
- 圖片資源最佳化

### 相容性
- 支援現代瀏覽器
- Chrome 擴充功能 Manifest V3
- 響應式設計

## 故障排除

### 常見問題
1. **憑證錯誤**：確認 `certs/` 目錄中的憑證檔案存在
2. **模組載入失敗**：檢查 `node_modules` 是否正確安裝
3. **環境變數未載入**：確認對應的 `.env` 檔案存在

### 偵錯工具
- 瀏覽器開發者工具
- Chrome 擴充功能開發者模式
- Next.js 內建偵錯功能

## 貢獻指南

1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 建立 Pull Request

## 授權資訊

本專案為企業內部使用，保留所有權利。

---

如有任何問題或建議，請聯繫開發團隊。