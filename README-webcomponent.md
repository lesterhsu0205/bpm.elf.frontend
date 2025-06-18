# ELF Web Component 文檔

## 📋 概述

這個 Web Component 將 Next.js 動態頁面 `src/pages/[...applyItem].js` 包裝成可在任何網站中使用的自訂元素。支援兩種使用模式：

1. **Modal 模式** (`x-elf-wrapper-modal`)：點擊按鈕開啟彈窗，推薦使用
2. **直接渲染模式** (`x-elf-wrapper`)：頁面載入時立即顯示內容

## 🚀 快速開始

### Modal 方式（推薦）

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Modal 方式：點擊按鈕開啟彈窗 -->
  <x-elf-wrapper-modal 
    applyitem="vm" 
    backendurl="http://localhost:3000/bpm-elf"
    buttontext="🔧 開啟 VM 設定"
    buttonclass="btn btn-success">
  </x-elf-wrapper-modal>
  
  <!-- 引入 Web Component -->
  <script src="path/to/elf-webcomponent.js"></script>
</body>
</html>
```

### 直接渲染方式

```html
<!DOCTYPE html>
<html>
<body>
  <!-- 直接渲染：頁面載入時立即顯示 -->
  <x-elf-wrapper 
    applyitem="vm" 
    backendurl="http://localhost:3000/bpm-elf">
  </x-elf-wrapper>
  
  <!-- 引入 Web Component -->
  <script src="path/to/elf-webcomponent.js"></script>
</body>
</html>
```

## 📝 屬性說明

### x-elf-wrapper-modal

| 屬性名 | 類型 | 必需 | 預設值 | 說明 |
|--------|------|------|--------|------|
| `applyitem` | String | ✓ | - | 要載入的申請項目路徑 |
| `backendurl` | String | ✓ | - | 後端 API 的基礎 URL |
| `buttontext` | String | ✗ | '開啟頁面' | 按鈕顯示文字 |
| `buttonclass` | String | ✗ | 'btn btn-primary' | 按鈕 CSS 類別 |

### x-elf-wrapper

| 屬性名 | 類型 | 必需 | 說明 |
|--------|------|------|------|
| `applyitem` | String | ✓ | 要載入的申請項目路徑 |
| `backendurl` | String | ✓ | 後端 API 的基礎 URL |

### 工作原理

1. 組件會根據 `applyitem` 參數建構 API URL
2. 從 `{backendurl}/api/setting/{applyitem}.json` 載入設定
3. 使用原始的 `Content` 組件渲染動態表單

## 🔧 本地開發設定

### 建置 Web Component

```bash
npm run build:webcomponent
```

這會：
1. 使用 Webpack 將 `src/webComponent.js` 打包成獨立檔案
2. 輸出到 `dist/elf-webcomponent.js`
3. 複製到 `public/js/elf-webcomponent.js` 供本地 CDN 使用

### 本地檔案結構

```
public/js/elf-webcomponent.js （源檔案）
dist/bpm-elf-frontend/public/js/elf-webcomponent.js （部署檔案）
```

### 本地 CDN 設定

如果您的 BPM ELF 系統運行在 `http://localhost:3000`，Web Component 檔案會自動透過以下 URL 提供：

```
http://localhost:3000/bpm-elf/js/elf-webcomponent.js
```

這是因為 `build.js` 會自動將 `public` 目錄複製到建置輸出中。

### 本地測試範例

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Modal 方式：點擊按鈕開啟彈窗 -->
  <x-elf-wrapper-modal 
    applyitem="vm" 
    backendurl="http://localhost:3000/bpm-elf"
    buttontext="🔧 開啟 VM 設定"
    buttonclass="btn btn-success">
  </x-elf-wrapper-modal>
  
  <!-- 從本地 CDN 載入 Web Component -->
  <script src="http://localhost:3000/bpm-elf/js/elf-webcomponent.js"></script>
</body>
</html>
```

```html
<!DOCTYPE html>
<html>
<body>
  <!-- 直接渲染：頁面載入時立即顯示 -->
  <x-elf-wrapper 
    applyitem="vm" 
    backendurl="http://localhost:3000/bpm-elf">
  </x-elf-wrapper>
  
  <!-- 從本地 CDN 載入 Web Component -->
  <script src="http://localhost:3000/bpm-elf/js/elf-webcomponent.js"></script>
</body>
</html>
```

## 💡 JavaScript 動態載入

### Modal 組件動態載入

```javascript
if (!customElements.get('x-elf-wrapper-modal')) {
  const script = document.createElement('script');
  script.src = 'http://localhost:3000/bpm-elf/js/elf-webcomponent.js';
  script.onload = function() {
    console.log('Web Component 載入完成');
    
    // 動態創建 Modal 組件
    const modalComponent = document.createElement('x-elf-wrapper-modal');
    modalComponent.setAttribute('applyitem', 'vm');
    modalComponent.setAttribute('backendurl', 'http://localhost:3000/bpm-elf');
    modalComponent.setAttribute('buttontext', '🔧 開啟設定');
    modalComponent.setAttribute('buttonclass', 'btn btn-success');
    
    document.getElementById('target-container').appendChild(modalComponent);
  };
  document.head.appendChild(script);
}
```

### 直接渲染組件動態載入

```javascript
if (!customElements.get('x-elf-wrapper')) {
  const script = document.createElement('script');
  script.src = 'http://localhost:3000/bpm-elf/js/elf-webcomponent.js';
  script.onload = function() {
    console.log('Web Component 載入完成');
    
    // 動態創建直接渲染組件
    const dynamicPage = document.createElement('x-elf-wrapper');
    dynamicPage.setAttribute('applyitem', 'vm');
    dynamicPage.setAttribute('backendurl', 'http://localhost:3000/bpm-elf');
    
    document.getElementById('target-container').appendChild(dynamicPage);
  };
  document.head.appendChild(script);
}
```

## 🏗️ 建置和部署

### 建置指令

```bash
npm run build:webcomponent

# 輸出檔案：dist/elf-webcomponent.js (536KB)
```

## 🌐 生產環境 CDN 部署

### 上傳到 CDN

```bash
# 範例：上傳到 CDN
cp dist/elf-webcomponent.js /path/to/cdn/js/
```

### CDN URL 設定

假設您的 CDN 域名是 `https://cdn.yourcompany.com`，則檔案 URL 為：
```
https://cdn.yourcompany.com/js/elf-webcomponent.js
```

### 生產環境範例

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Modal 方式：點擊按鈕開啟彈窗 -->
  <x-elf-wrapper-modal 
    applyitem="sample-form" 
    backendurl="https://your-api-server.com"
    buttontext="📝 開啟表單"
    buttonclass="btn btn-primary btn-lg">
  </x-elf-wrapper-modal>
  
  <!-- 從 CDN 載入 Web Component -->
  <script src="https://cdn.yourcompany.com/js/elf-webcomponent.js"></script>
</body>
</html>
```

```html
<!DOCTYPE html>
<html>
<body>
  <!-- 直接渲染：頁面載入時立即顯示 -->
  <x-elf-wrapper 
    applyitem="sample-form" 
    backendurl="https://your-api-server.com">
  </x-elf-wrapper>
  
  <!-- 從 CDN 載入 Web Component -->
  <script src="https://cdn.yourcompany.com/js/elf-webcomponent.js"></script>
</body>
</html>
```

### 異步載入

```javascript
(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.yourcompany.com/js/elf-webcomponent.js';
  script.async = true;
  script.onload = function() {
    console.log('ELF Web Component 載入完成');
    
    // 載入完成後動態創建 Modal 組件
    const modalComponent = document.createElement('x-elf-wrapper-modal');
    modalComponent.setAttribute('applyitem', 'sample-form');
    modalComponent.setAttribute('backendurl', 'https://your-api-server.com');
    modalComponent.setAttribute('buttontext', '📝 異步載入的表單');
    modalComponent.setAttribute('buttonclass', 'btn btn-info');
    
    document.getElementById('async-container').appendChild(modalComponent);
  };
  document.head.appendChild(script);
})();
```

### 條件載入

```javascript
if (!customElements.get('x-elf-wrapper-modal')) {
  const script = document.createElement('script');
  script.src = 'https://cdn.yourcompany.com/js/elf-webcomponent.js';
  document.head.appendChild(script);
}
```

## 🔧 進階配置

### 版本控制

```bash
# 建置時加入版本號
cp dist/elf-webcomponent.js /path/to/cdn/js/dynamic-page-webcomponent-v1.0.0.js
```

### 容錯機制

```javascript
function loadWebComponent() {
  const script = document.createElement('script');
  script.src = 'https://cdn.yourcompany.com/js/elf-webcomponent.js';
  script.onerror = function() {
    // 主 CDN 失敗，使用備用 CDN
    const fallbackScript = document.createElement('script');
    fallbackScript.src = 'https://backup-cdn.yourcompany.com/js/elf-webcomponent.js';
    document.head.appendChild(fallbackScript);
  };
  document.head.appendChild(script);
}

loadWebComponent();
```

## 🧪 本地測試

### 驗證本地 CDN

在瀏覽器中直接訪問：
```
http://localhost:3000/bpm-elf/js/elf-webcomponent.js
```

### 除錯工具

```javascript
// 檢查組件是否已註冊
console.log('Modal 註冊狀態:', !!customElements.get('x-elf-wrapper-modal'));
console.log('Direct 註冊狀態:', !!customElements.get('x-elf-wrapper'));

// 檢查檔案是否載入
fetch('http://localhost:3000/bpm-elf/js/elf-webcomponent.js')
  .then(response => {
    console.log('檔案可訪問:', response.ok);
  });
```

## 🎯 使用建議

### 選擇模式
- **Modal 模式**：適合整合到現有頁面，按需載入，不影響頁面佈局
- **直接渲染模式**：適合獨立頁面或需要即時顯示的場景

### 效能優化
- 使用 Modal 模式可以減少初始載入時間
- 考慮使用異步載入避免阻塞頁面渲染
- 生產環境建議使用 CDN 加速載入

### 最佳實踐
- 在老系統中整合時，建議先使用 Modal 模式測試
- 確保 `backendurl` 指向正確的 API 端點
- 使用描述性的 `buttontext` 提升用戶體驗
