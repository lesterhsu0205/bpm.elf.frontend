/**
 * 將 JS 物件轉成 JSON 檔並觸發下載
 * @param {object} data   要下載的 JSON 物件
 * @param {string} filename   下載檔名（帶 .json）
 */
export default function downloadJson(data, filename) {
  // 1. 把 JS 物件轉成字串（貼心地做縮排，方便開啟檔案時閱讀）
  const jsonStr = JSON.stringify(data, null, 2);

  // 2. 用 Blob 包裝成 application/json 類型
  const blob = new Blob([jsonStr], { type: "application/json" });

  // 3. 產生臨時 URL
  const url = URL.createObjectURL(blob);

  // 4. 建立一個隱形 <a>，並設定 href/download
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // 例如 "config.json"

  // 5. 把 <a> 元素加到 DOM、觸發 click，觸發下載
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 6. 釋放這個 object URL
  URL.revokeObjectURL(url);
}
