// web-component.js
import React, { useState, useRef } from 'react'
import ReactDOMClient from 'react-dom/client'
import reactToWebComponent from 'react-to-webcomponent'
import Content from './components/content.js'
import ChromeNavMegaMenuSimple from './components/chromeNavMegaMenuSimple.js'
import { ToastContainer } from 'react-toastify'
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

  // 儲存每個頁面的 Content 組件 ref
  const contentRefs = useRef({})

  // 載入特定 applyitem 的數據
  const loadApplyItemData = async (targetApplyItem, itemName = null, isReload = false, isCompose = false) => {
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

      let targetPath
      if (isCompose === true) {
        targetPath = `${backendurl}/api/setting/compose/${targetItem}.json`
      } else {
        targetPath = `${backendurl}/api/setting/${targetItem}.json`
      }

      console.info(`🚀 載入新數據: ${targetPath}`)
      const response = await fetch(targetPath)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const jsonData = await response.json()
      console.info('✅ 數據載入完成:', JSON.stringify(jsonData))

      // 保存到 pagesData (只保存必要數據)
      setPagesData(prev => ({
        ...prev,
        [cleanApplyItem]: {
          isCompose,
          data: jsonData,
          name: itemName || cleanApplyItem // 顯示名稱
        }
      }))
      
      // 設置為當前頁面
      setCurrentApplyItem(cleanApplyItem)

      // 如果是重新載入，清空當前頁面的表單
      if (isReload && contentRefs.current[cleanApplyItem]) {
        console.info('🧹 清空表單數據')
        setTimeout(() => {
          contentRefs.current[cleanApplyItem]?.reset()
        }, 100) // 稍微延遲以確保組件已重新渲染
      }
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
  const handleMenuItemSelect = (selectedApplyItem, itemName = null, isCompose = false) => {
    if (!selectedApplyItem || typeof selectedApplyItem !== 'string' || !selectedApplyItem.trim()) {
      setGlobalError('無效的項目選擇')
      return
    }
    
    const trimmedValue = selectedApplyItem.trim()
    console.info('🔤 從 mega menu 選擇 applyitem:', trimmedValue)
    loadApplyItemData(trimmedValue, itemName, false, isCompose)
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
          <Content 
            ref={(ref) => {
              if (ref) {
                contentRefs.current[applyItem] = ref
              }
            }}
            config={pageData.data} 
          />
        </div>
      )
    })
  }

  return (
    <>
      {/* 主要內容容器 - 留出底部空間給固定 footer */}
      <div style={{ paddingBottom: '40px', minHeight: 'calc(100vh - 40px)' }}>
        {/* Mega Menu 導航 - 始終顯示 */}
        <ChromeNavMegaMenuSimple 
          onItemSelect={handleMenuItemSelect}
          onManualInput={loadApplyItemData}
          backendurl={backendurl}
          currentApplyItem={currentApplyItem}
          currentItemName={pagesData[currentApplyItem]?.name}
          currentIsCompose={pagesData[currentApplyItem]?.isCompose}
          globalLoading={globalLoading}
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
            {/* 已載入單據標籤 */}
            {Object.keys(pagesData).length > 1 && (
              <div className="mb-2 d-flex align-items-center gap-2 flex-wrap">
                <small className="text-muted">已載入單據：</small>
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
            )}
            
            {/* 控制按鈕 */}
            {/* <div className="d-flex align-items-center gap-2 mb-3">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => loadApplyItemData(currentApplyItem, pagesData[currentApplyItem]?.name, true, pagesData[currentApplyItem]?.isCompose)}
                disabled={globalLoading}
              >🔄 重新載入
              </button>
              <span className="badge bg-info">{currentApplyItem}.json</span>
            </div> */}
          </div>
          
          {/* 所有頁面內容（用 CSS 控制顯示/隱藏）*/}
          {renderAllPagesContent()}
        </div>
      ) : (
        /* 歡迎頁面 */
        !globalLoading && !globalError && (
          <div style={{ 
            padding: '40px 20px', 
            textAlign: 'center', 
            maxWidth: '600px', 
            margin: '0 auto',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <img src="magician-hat512.png"
                  alt="BPM ELF Logo" 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    marginRight: '12px',
                    flexShrink: 0
                  }}
                />
                <h2 className="mb-0" style={{ 
                  fontWeight: '300', 
                  fontSize: '2.2rem',
                  color: '#2c3e50',
                  letterSpacing: '-0.5px'
                }}>
                  BPM ELF
                </h2>
              </div>
              <h5 className="mb-4" style={{ 
                fontWeight: '400',
                color: '#34495e',
                lineHeight: '1.6'
              }}>
                你也在追求更「絲滑」的開單體驗嗎？
              </h5>
              <div className="mx-auto" style={{ 
                maxWidth: '420px',
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#7f8c8d'
              }}>
                <p className="mb-3">
                  專為 BPM 系統設計的智能助手<br/>
                  簡化繁瑣的開單填寫流程<br/>
                  讓您專注更重要的業務決策
                </p>
                <p style={{ fontSize: '14px', color: '#95a5a6' }}>
                  從上方導航選單開始您的高效開單之旅 ✨
                </p>
              </div>
            </div>
            
            {/* 顯示已載入的頁面 */}
            {Object.keys(pagesData).length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h6 style={{ 
                  color: '#6c757d', 
                  fontWeight: '500',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  快速切換已載入的單據
                </h6>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {Object.keys(pagesData).map(item => (
                    <button
                      key={item}
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setCurrentApplyItem(item)}
                      style={{
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {pagesData[item]?.name || item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
      </div>
      
      {/* Footer - 固定在視窗底部 */}
      <footer 
        className="d-flex align-items-center justify-content-center py-1" 
        style={{ 
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          width: '100%',
          backgroundColor: 'transparent', 
          height: '28px', 
          fontSize: '11px',
          color: '#6c757d',
          zIndex: 999
        }}
      >
        <div>
          <p className="mb-0" style={{ fontSize: '11px' }}>
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            LineBank BXI. All Rights Reserved.
          </p>
        </div>
      </footer>
      
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
