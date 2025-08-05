// web-component.js
import React, { useState, useEffect, useRef } from 'react'
import ReactDOMClient from 'react-dom/client'
import reactToWebComponent from 'react-to-webcomponent'
import Content from './components/content.js'
import ChromeNavMegaMenuSimple from './components/chromeNavMegaMenuSimple.js'
import { ToastContainer } from 'react-toastify'
import { FormProvider, useForm } from 'react-hook-form'
// 引入 Bootstrap 樣式
import 'bootstrap/dist/css/bootstrap.min.css'
// 引入 Web Component 專用樣式
import '@/styles/webcomponent.css'
// 引入 ToastContainer 樣式
import 'react-toastify/dist/ReactToastify.css'

// Chrome 組件
const ELFWrapperChrome = ({ backendurl = process.env.NEXT_PUBLIC_WEB_COMPONENT_URL }) => {
  // 極簡模式 - 只保存配置數據和當前頁面
  const [pagesData, setPagesData] = useState({}) // { applyitem: { data, name } }
  const [currentApplyItem, setCurrentApplyItem] = useState(null)
  
  // 全局狀態
  const [globalLoading, setGlobalLoading] = useState(false)
  const [globalError, setGlobalError] = useState(null)

  // 載入特定 applyitem 的數據
  const loadApplyItemData = async (targetApplyItem, itemName = null, isReload = false) => {
    if (!targetApplyItem || typeof targetApplyItem !== 'string' || !targetApplyItem.trim()) {
      setGlobalError(`缺少有效的 applyitem 參數，當前值: ${targetApplyItem}`)
      return
    }

    const cleanApplyItem = targetApplyItem.trim()
    
    // 如果已經載入過，直接切換，不重新載入
    if (pagesData[cleanApplyItem] && !isReload) {
      console.info('🔄 切換到已載入的頁面:', cleanApplyItem)
      setCurrentApplyItem(cleanApplyItem)
      setGlobalError(null)
      return
    }

    try {
      setGlobalLoading(true)
      setGlobalError(null)

      // 處理 applyitem 路徑（可能是 /path/to/item 或 path/to/item）
      const cleanPath = cleanApplyItem.split('/').filter(Boolean)
      const targetItem = cleanPath[cleanPath.length - 1]

      if (!targetItem) {
        throw new Error('無效的 applyitem 路徑')
      }

      console.info(`🚀 載入新數據: ${backendurl}/api/setting/${targetItem}.json`)

      const response = await fetch(`${backendurl}/api/setting/${targetItem}.json`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const jsonData = await response.json()
      console.info('✅ 數據載入完成:', JSON.stringify(jsonData))

      // 保存到 pagesData (只保存必要數據)
      setPagesData(prev => ({
        ...prev,
        [cleanApplyItem]: {
          data: jsonData,
          name: itemName || cleanApplyItem // 顯示名稱
        }
      }))
      
      // 設置為當前頁面
      setCurrentApplyItem(cleanApplyItem)
    }
    catch (err) {
      console.error('🔥 Fetch Error:', err)
      setGlobalError(`載入失敗: ${err.message}`)
      
      // 失敗時不保存到 pagesData，直接顯示全局錯誤
    }
    finally {
      setGlobalLoading(false)
    }
  }

  // 處理 mega menu 項目選擇
  const handleMenuItemSelect = (selectedApplyItem, itemName = null) => {
    if (!selectedApplyItem || typeof selectedApplyItem !== 'string' || !selectedApplyItem.trim()) {
      setGlobalError('無效的項目選擇')
      return
    }
    
    const trimmedValue = selectedApplyItem.trim()
    console.info('🔤 從 mega menu 選擇 applyitem:', trimmedValue)
    loadApplyItemData(trimmedValue, itemName)
  }

  // 極簡版本：直接渲染所有已載入的 Content 組件
  const renderAllPagesContent = () => {
    return Object.keys(pagesData).map(applyItem => {
      const pageData = pagesData[applyItem]
      const isCurrentPage = applyItem === currentApplyItem

      return (
        <div 
          key={applyItem}
          style={{ 
            display: isCurrentPage ? 'block' : 'none'
          }}
        >
          {/* Content 組件自己管理所有狀態，包括表單數據 */}
          <Content config={pageData.data} />
        </div>
      )
    })
  }

  return (
    <>
      {/* Mega Menu 導航 - 始終顯示 */}
      <ChromeNavMegaMenuSimple 
        onItemSelect={handleMenuItemSelect}
        onManualInput={loadApplyItemData}
        backendurl={backendurl}
      />
      
      {/* 全局錯誤顯示 */}
      {globalError && (
        <div style={{ padding: '0 20px' }}>
          <div className="alert alert-danger" role="alert">
            <strong>錯誤:</strong> {globalError}
          </div>
        </div>
      )}
      
      {/* 全局載入狀態 */}
      {globalLoading && (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <div style={{ marginTop: '15px' }}>載入中...</div>
        </div>
      )}
      
      {/* 內容區域 */}
      {currentApplyItem ? (
        <div>
          {/* 控制區域 */}
          <div style={{ padding: '0 20px' }}>
            {/* 已載入頁面標籤 */}
            {Object.keys(pagesData).length > 1 && (
              <div className="mb-2">
                <small className="text-muted">已載入頁面：</small>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {Object.keys(pagesData).map(item => (
                    <button
                      key={item}
                      className={`btn btn-sm ${item === currentApplyItem ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setCurrentApplyItem(item)}
                      disabled={item === currentApplyItem}
                    >
                      {pagesData[item]?.name || item}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 控制按鈕 */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => loadApplyItemData(currentApplyItem, null, true)}
                disabled={globalLoading}
              >🔄 重新載入
              </button>
              <span className="badge bg-info">{currentApplyItem}</span>
            </div>
          </div>
          
          {/* 所有頁面內容（用 CSS 控制顯示/隱藏）*/}
          {renderAllPagesContent()}
        </div>
      ) : (
        /* 歡迎頁面 */
        !globalLoading && !globalError && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h4 className="mb-3">歡迎使用 BPM ELF</h4>
            <p className="text-muted">請從上方導航選單選擇要載入的項目，或使用選單中的手動輸入功能</p>
            
            {/* 顯示已載入的頁面 */}
            {Object.keys(pagesData).length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h6>已載入的頁面：</h6>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {Object.keys(pagesData).map(item => (
                    <button
                      key={item}
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setCurrentApplyItem(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

const ELFWrapperChromeContainer = reactToWebComponent(ELFWrapperChrome, React, ReactDOMClient, {
  props: ['backendurl'],
})

// 註冊 Web Components
customElements.define('x-elf-wrapper-chrome', ELFWrapperChromeContainer)

export {
  ELFWrapperChromeContainer }
