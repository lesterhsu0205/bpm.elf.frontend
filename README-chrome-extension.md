# BPM ELF Chrome 擴充功能安裝與使用指南

本文檔說明如何安裝和使用 BPM ELF 開單小幫手的 Chrome 瀏覽器擴充功能。

## 功能特色

### 🌟 主要功能
- **快速存取**：直接從瀏覽器工具列啟動 BPM ELF 功能
- **獨立視窗**：在獨立的瀏覽器視窗中開啟表單介面
- **Manifest V3**：採用最新的 Chrome 擴充功能標準
- **安全沙箱**：使用安全的沙箱環境執行

### 🛡️ 安全特性
- Content Security Policy (CSP) 保護
- 最小權限原則
- 沙箱模式執行

## 擴充功能檔案結構

```
bpm_elf_extension/
├── manifest.json              # 擴充功能配置檔
├── background.js             # 背景服務工作者
├── window.html               # 主要介面頁面
├── elf-chrome-component.js   # 主要組件邏輯
├── elf-chrome-component.js.LICENSE.txt  # 授權資訊
└── 圖示檔案
    ├── magician-hat.png      # 48x48 圖示
    ├── magician-hat128.png   # 128x128 圖示
    └── magician-hat512.png   # 512x512 圖示
```

## 安裝步驟

### 方法一：開發者模式安裝（本地開發）

1. **開啟 Chrome 瀏覽器**

2. **進入擴充功能頁面**
   - 在網址列輸入：`chrome://extensions/`
   - 或點選 Chrome 選單 → 更多工具 → 擴充功能

3. **啟用開發者模式**
   - 在擴充功能頁面右上角開啟「開發人員模式」開關

4. **載入擴充功能**
   - 點選「載入未封裝項目」
   - 選擇專案中的 `bpm_elf_extension/` 資料夾
   - 點選「選取資料夾」

5. **驗證安裝**
   - 擴充功能應該出現在清單中
   - 瀏覽器工具列會顯示魔術師帽子圖示

### 方法二：打包檔案安裝

1. **建立擴充功能包**
   ```bash
   # 在專案根目錄執行
   cd bpm_elf_extension
   zip -r bpm-elf-extension.zip .
   ```

2. **在開發者模式中安裝 ZIP 檔案**
   - 按照方法一的步驟 1-3
   - 點選「載入未封裝項目」改為拖拽 ZIP 檔案到頁面

## 使用說明

### 啟動擴充功能

1. **點選工具列圖示**
   - 在瀏覽器工具列找到魔術師帽子圖示
   - 點選圖示啟動 BPM ELF 開單小幫手

2. **獨立視窗模式**
   - 擴充功能會在新的瀏覽器視窗中開啟
   - 提供完整的 BPM ELF 功能介面

### 主要操作流程

1. **開啟表單**
   - 點選工具列的 BPM ELF 圖示
   - 系統會開啟獨立的表單視窗

2. **填寫表單**
   - 在開啟的視窗中填寫所需資訊
   - 支援多種表單元素類型

3. **提交與管理**
   - 完成填寫後提交表單
   - 可透過視窗管理多個表單

## 技術架構

### Manifest V3 配置

```json
{
  "manifest_version": 3,
  "name": "BPM ELF 開單小幫手",
  "version": "0.0.2",
  "permissions": ["windows"],
  "background": {
    "service_worker": "background.js"
  }
}
```

### 關鍵特性
- **Service Worker**：使用現代化的背景服務工作者
- **視窗權限**：可建立和管理瀏覽器視窗
- **安全沙箱**：在受控環境中執行腳本

### 安全性設定

#### Content Security Policy (CSP)
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';",
    "sandbox": "sandbox allow-scripts allow-forms; script-src 'self' 'unsafe-eval'; object-src 'self';"
  }
}
```

## 故障排除

### 常見問題與解決方案

#### 1. 擴充功能無法載入
**問題**：載入擴充功能時出現錯誤

**解決方案**：
- 確認 `bpm_elf_extension/` 資料夾包含所有必要檔案
- 檢查 `manifest.json` 語法是否正確
- 確保已啟用「開發人員模式」

#### 2. 圖示不顯示
**問題**：工具列中沒有顯示擴充功能圖示

**解決方案**：
- 重新載入擴充功能
- 檢查 Chrome 工具列的擴充功能選單
- 確認圖示檔案路徑正確

#### 3. 功能無法正常運作
**問題**：點選圖示後沒有回應

**解決方案**：
- 檢查瀏覽器控制台的錯誤訊息
- 確認 `background.js` 和相關檔案載入正常
- 重新安裝擴充功能

#### 4. 視窗無法開啟
**問題**：擴充功能無法建立新視窗

**解決方案**：
- 確認瀏覽器未封鎖彈出視窗
- 檢查權限設定是否正確
- 重新整理擴充功能

### 除錯方法

#### 1. 檢查擴充功能狀態
```javascript
// 在瀏覽器控制台執行
chrome.management.getAll(extensions => {
  console.log(extensions.filter(ext => ext.name.includes('BPM ELF')));
});
```

#### 2. 查看背景腳本日誌
- 進入 `chrome://extensions/`
- 找到 BPM ELF 擴充功能
- 點選「檢查檢視」→「背景頁面」

#### 3. 檢查沙箱頁面
- 按 F12 開啟開發者工具
- 檢查 Console 和 Network 標籤頁

## 開發與客製化

### 修改擴充功能

1. **編輯設定檔**
   ```json
   // manifest.json
   {
     "name": "您的自訂名稱",
     "version": "1.0.0"
   }
   ```

2. **更新圖示**
   - 替換 `magician-hat*.png` 檔案
   - 保持相同的檔案名稱和尺寸

3. **重新載入**
   - 在擴充功能頁面點選「重新載入」按鈕

### 建構新版本

```bash
# 建構 Chrome 組件
pnpm run webcomponent:prod

# 複製檔案到擴充功能目錄
cp dist/elf-chrome-component.js* bpm_elf_extension/
```

## 更新與版本管理

### 更新擴充功能

1. **自動更新**（開發模式）
   - 修改檔案後在擴充功能頁面點選「重新載入」

2. **版本升級**
   - 更新 `manifest.json` 中的版本號
   - 重新載入擴充功能

### 版本記錄

- **v0.0.2**：當前版本，基本功能完整
- **v0.0.1**：初始版本

## 相關資源

- [Chrome 擴充功能開發文檔](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 遷移指南](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Content Security Policy](https://developer.chrome.com/docs/extensions/mv3/content_security_policy/)

## 技術支援

如遇到任何問題，請：
1. 查看瀏覽器控制台的錯誤訊息
2. 檢查擴充功能的除錯資訊
3. 參考本文檔的故障排除章節
4. 聯繫開發團隊取得支援

---

**注意**：本擴充功能僅供企業內部使用，請勿在 Chrome Web Store 公開發布。