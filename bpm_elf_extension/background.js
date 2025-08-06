// Background script for Chrome Extension
// 處理擴充功能圖示點擊事件，開啟新視窗

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // 檢查是否已經有同樣的視窗開啟
    const existingWindows = await chrome.windows.getAll({
      populate: true,
      windowTypes: ['popup']
    });
    
    // 查找是否已有 BPM 視窗開啟
    const existingBpmWindow = existingWindows.find(window => 
      window.tabs.some(tab => 
        tab.url && tab.url.includes(chrome.runtime.getURL('window.html'))
      )
    );
    
    if (existingBpmWindow) {
      // 如果視窗已存在，聚焦到該視窗
      await chrome.windows.update(existingBpmWindow.id, { focused: true });
    } else {
      // 建立新視窗（popup 類型，只有標題欄）
      await chrome.windows.create({
        url: chrome.runtime.getURL('window.html'),
        type: 'popup',
        width: 1200,
        height: 800,
      });
    }
  } catch (error) {
    console.error('Error creating window:', error);
  }
});

// 監聽視窗關閉事件
chrome.windows.onRemoved.addListener((windowId) => {
  console.log('Window closed:', windowId);
});
