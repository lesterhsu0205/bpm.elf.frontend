# BPM ELF Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14.1.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

一個基於 Next.js 的 BPM（Business Process Management）前端系統，提供動態表單生成、Web Components 以及 Chrome 擴展功能。

## ✨ 主要特性

- 📝 **配置驅動的動態表單**：基於 JSON 配置自動渲染表單元素
- 🔧 **多平台整合**：
  - Next.js Web 應用程式
  - Web Components（Modal 和直接渲染模式）
  - Chrome 瀏覽器擴展
- 🌍 **多環境支援**：支援 dev.local、dev、stg、uat、prod 等環境
- 🔐 **SSL 整合**：內建 SSL 憑證配置支援
- 📦 **模組化架構**：可重用的表單元件和組織化的檔案結構

## 🚀 快速開始

### 環境要求

- Node.js (推薦 16.x 或更高版本)
- pnpm (推薦的套件管理器)

### 安裝依賴

```bash
pnpm install
```

### 本地開發

啟動本地開發伺服器（包含 SSL 憑證和 Web Component 構建）：

```bash
pnpm local
```

預設會在 `https://localhost:3000` 啟動應用程式。

### 構建

#### 環境特定構建
```bash
# 本地開發環境
pnpm run build:dev.local

# 開發環境
pnpm run build:dev

# 測試環境
pnpm run build:stg

# UAT 環境
pnpm run build:uat

# 正式環境
pnpm run build:prod
```

#### 僅構建 Web Component
```bash
pnpm run build:webcomponent
```

### 生產啟動

```bash
pnpm start
```

## 🏗️ 專案架構

### 核心組件

- **`src/pages/[...applyItem].js`**：動態頁面路由，載入 JSON 配置
- **`src/components/content.js`**：核心表單渲染引擎
- **`src/webComponent.js`**：Modal 模式 Web Component
- **`src/chromeComponent.js`**：Chrome 擴展組件
- **`src/components/formElements/`**：模組化表單元件

### 工作原理

1. **路由**：`[...applyItem].js` 接收 `applyItem` 參數
2. **配置載入**：從 `${BACKEND_URL}/api/setting/${applyItem}.json` 載入 JSON 配置
3. **動態渲染**：`content.js` 處理配置並渲染對應的表單元素

### 檔案結構

```
src/
├── pages/                    # Next.js 頁面
│   ├── [...applyItem].js    # 動態路由頁面
│   ├── compose/             # 表單編輯頁面
│   └── settings/            # 設定頁面
├── components/              # React 組件
│   ├── formElements/        # 表單元件
│   │   ├── text.js         # 文字輸入
│   │   ├── select.js       # 下拉選單
│   │   ├── checkbox.js     # 複選框
│   │   └── ...
│   ├── content.js          # 核心內容渲染器
│   └── layout.js           # 頁面佈局
├── styles/                  # 樣式檔案
└── utils/                   # 工具函數
```

## 🔧 Web Components

### Modal 模式（推薦）

```html
<x-elf-wrapper-modal 
  applyitem="vm" 
  backendurl="http://localhost:3000/bpm-elf"
  buttontext="開啟表單"
  buttonclass="btn btn-primary">
</x-elf-wrapper-modal>

<script src="path/to/elf-webcomponent.js"></script>
```

### 直接渲染模式

```html
<x-elf-wrapper 
  applyitem="vm" 
  backendurl="http://localhost:3000/bpm-elf">
</x-elf-wrapper>

<script src="path/to/elf-webcomponent.js"></script>
```

詳細的 Web Component 使用說明請參閱 [README-webcomponent.md](./README-webcomponent.md)。

## 🌐 環境配置

系統支援多環境配置，使用對應的 `.env` 檔案：

- `.env.dev.local` - 本地開發環境
- `.env.dev` - 開發環境
- `.env.stg` - 測試環境
- `.env.uat` - UAT 環境
- `.env.prod` - 正式環境

### 關鍵環境變數

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/bpm-elf
NEXT_PUBLIC_WEB_COMPONENT_URL=http://localhost:3000/bpm-elf
NEXT_PUBLIC_FED_DIST_GOLD_DIR_PREFIX=/path/to/dist
```

## 🔐 SSL 配置

專案內建 SSL 憑證支援，憑證檔案位於 `certs/` 目錄：

- `lbtw.ca.starlbtwsys.20230719.20321231.crt`
- `lbtw.ca.starlbtwsys.20230719.20321231.key`
- `lbtw.ca.starlbtwsys.20230719.20321231.pem`

`patch-https.js` 檔案負責配置 Node.js 使用這些憑證。

## 📦 構建系統

### Webpack 配置

- **`webpack.webcomponent.config.js`**：構建 Web Component 到 `public/js/`
- **`webpack.chrome.component.config.js`**：構建 Chrome 擴展到 `bpm_elf_extension/`

### 後構建處理

`build.js` 腳本執行以下操作：
- 創建部署套件
- 生成 TAR 壓縮檔
- 處理靜態資源

### 部署模式

1. **Node.js Standalone**：使用 Next.js standalone 輸出和自訂伺服器
2. **靜態 WAR**：用於部署到 Java 應用伺服器

## 🧪 開發與測試

### 代碼檢查

```bash
pnpm lint
```

### 本地測試

訪問 `https://localhost:3000` 進行本地測試，或使用提供的測試 HTML 檔案。

## 🚀 Chrome 擴展

Chrome 擴展組件提供：
- 巨型選單導航
- 多頁面支援
- 瀏覽器擴展整合

構建的擴展檔案輸出至 `bpm_elf_extension/` 目錄。

## 📋 可用指令

```bash
# 開發
pnpm local                    # 本地開發伺服器
pnpm lint                     # 代碼檢查

# 構建
pnpm run build:webcomponent   # 僅構建 Web Component
pnpm run build:dev.local      # 本地開發環境構建
pnpm run build:dev            # 開發環境構建
pnpm run build:stg            # 測試環境構建
pnpm run build:uat            # UAT 環境構建
pnpm run build:prod           # 正式環境構建

# 運行
pnpm start                    # 生產伺服器啟動
```

## 🔧 技術棧

- **前端框架**：Next.js 14.1.4, React 18.3.1
- **樣式**：Tailwind CSS, Bootstrap, Material Tailwind
- **表單**：React Hook Form
- **構建工具**：Webpack 5, Babel
- **Web Components**：react-to-webcomponent
- **其他**：Lodash, React Bootstrap, React Toastify

## 📝 授權

此專案為私有專案，版權歸屬於相關組織。
