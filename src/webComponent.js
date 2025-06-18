// web-component.js
import React, { useState, useEffect, useRef } from 'react'
import ReactDOMClient from 'react-dom/client'
import reactToWebComponent from 'react-to-webcomponent'
import Content from './components/content.js'
import { ToastContainer } from 'react-toastify'
import { FormProvider, useForm } from 'react-hook-form'
// 引入 Bootstrap 樣式
import 'bootstrap/dist/css/bootstrap.min.css'
// 引入 Web Component 專用樣式
import '@/styles/webcomponent.css'
// 引入 ToastContainer 樣式
import 'react-toastify/dist/ReactToastify.css'

// Modal 組件
const ELFWrapperModal = ({ applyitem, backendurl = process.env.NEXT_PUBLIC_WEB_COMPONENT_URL, buttontext = '開啟頁面', buttonclass = 'btn btn-primary' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastapplyitem, setlastapplyitem] = useState(null) // 記錄上次載入的 applyitem
  const modalRef = useRef(null)
  const methods = useForm({ mode: 'all' })

  const fetchData = async (forceReload = false) => {
    if (!applyitem || !backendurl) {
      setError('缺少必要參數: applyitem 或 backendurl')
      setLoading(false)
      return
    }

    // 檢查是否需要重新載入數據
    const needReload = forceReload || lastapplyitem !== applyitem || !data

    if (!needReload) {
      console.info(`🔄 applyitem 未變更 (${applyitem})，保留現有數據和表單內容`)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 處理 applyitem 路徑（可能是 /path/to/item 或 path/to/item）
      const cleanPath = applyitem.split('/').filter(Boolean)
      const targetItem = cleanPath[cleanPath.length - 1]

      console.info(`🚀 載入新數據: ${backendurl}/api/setting/${targetItem}.json`)

      const response = await fetch(`${backendurl}/api/setting/${targetItem}.json`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const jsonData = await response.json()
      console.info('✅ 數據載入完成:', JSON.stringify(jsonData))

      setData(jsonData)
      setlastapplyitem(applyitem) // 更新記錄的 applyitem

      // 只有在數據變更時才重置表單
      methods.reset()
    }
    catch (err) {
      console.error('🔥 Fetch Error:', err)
      setError(`載入失敗: ${err.message}`)
    }
    finally {
      setLoading(false)
    }
  }

  const openModal = () => {
    setIsOpen(true)
    // 只在初次載入或 applyitem 變更時才 fetch 數據
    if (!data || lastapplyitem !== applyitem) {
      fetchData(true) // 強制重新載入
    }
    else {
      console.info(`🔄 Modal 重新開啟，保留現有數據和表單內容 (${applyitem})`)
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    // 不清除 data 和 error，保留數據供下次開啟使用
    // setData(null) - 移除這行
    // setError(null) - 移除這行
  }

  // 監聽 applyitem 變化，如果變化則重新載入
  useEffect(() => {
    if (applyitem !== lastapplyitem && lastapplyitem !== null) {
      console.info(`📝 applyitem 已變更: ${lastapplyitem} → ${applyitem}`)
      fetchData(true) // 強制重新載入
    }
  }, [applyitem])

  // 點擊遮罩關閉 Modal
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal()
    }
  }

  // ESC 鍵關閉 Modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27 && isOpen) {
        closeModal()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen])

  const renderModalContent = () => {
    if (loading) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <div style={{ marginTop: '15px' }}>載入中...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div style={{ padding: '20px' }}>
          <div className="alert alert-danger" role="alert">
            <strong>錯誤:</strong>
            {' '}
            {error}
          </div>
        </div>
      )
    }

    if (!data) {
      return (
        <div style={{ padding: '20px' }}>
          <div className="alert alert-warning" role="alert">
            無法載入頁面資料
          </div>
        </div>
      )
    }

    return (
      <FormProvider {...methods}>
        <Content config={data} />
      </FormProvider>
    )
  }

  const getModalTitle = () => {
    if (lastapplyitem && lastapplyitem !== applyitem) {
      return `動態頁面 - ${applyitem} (更新中...)`
    }
    return `動態頁面 - ${applyitem}`
  }

  return (
    <>
      {/* 觸發按鈕 */}
      <button
        type="button"
        className={buttonclass}
        onClick={openModal}
      >
        {buttontext}
      </button>

      {/* Modal */}
      <div
        ref={modalRef}
        className="modal fade show"
        style={{
          display: isOpen ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1050,
        }}
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{getModalTitle()}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="關閉"
              >
              </button>
            </div>
            <div className="modal-body">
              {renderModalContent()}
            </div>
            <div className="modal-footer">
              <div className="d-flex justify-content-between w-100">
                <div>
                  {lastapplyitem && (
                    <small className="text-muted">
                      當前項目:
                      {' '}
                      {lastapplyitem}
                      {lastapplyitem !== applyitem && ` → ${applyitem}`}
                    </small>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-primary me-2"
                    onClick={() => fetchData(true)}
                    disabled={loading}
                  >
                    🔄 強制重新載入
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

// 原始的直接渲染組件（保持向後兼容）
// const ELFWrapper = ({ applyitem, backendurl }) => {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const methods = useForm({ mode: 'all' })

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!applyitem || !backendurl) {
//         setError('缺少必要參數: applyitem 或 backendurl')
//         setLoading(false)
//         return
//       }

//       try {
//         setLoading(true)
//         setError(null)

//         // 處理 applyitem 路徑（可能是 /path/to/item 或 path/to/item）
//         const cleanPath = applyitem.split('/').filter(Boolean)
//         const targetItem = cleanPath[cleanPath.length - 1]

//         console.info(`url: ${backendurl}/api/setting/${targetItem}.json`)

//         const response = await fetch(`${backendurl}/api/setting/${targetItem}.json`)

//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//         }

//         const jsonData = await response.json()
//         console.info('jsonData:', JSON.stringify(jsonData))

//         setData(jsonData)
//       }
//       catch (err) {
//         console.error('🔥 Fetch Error:', err)
//         setError(`載入失敗: ${err.message}`)
//       }
//       finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [applyitem, backendurl])

//   if (loading) {
//     return <div style={{ padding: '20px', textAlign: 'center' }}>載入中...</div>
//   }

//   if (error) {
//     return (
//       <div style={{ padding: '20px', color: 'red' }}>
//         錯誤:
//         {' '}
//         {error}
//       </div>
//     )
//   }

//   if (!data) {
//     return <div style={{ padding: '20px' }}>無法載入頁面資料</div>
//   }

//   return (
//     <>
//       <FormProvider {...methods}>
//         <Content config={data} />
//       </FormProvider>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </>
//   )
// }

// React 17+ 要用 createRoot
// const ELFWrapperContainer = reactToWebComponent(ELFWrapper, React, ReactDOMClient, {
//   props: ['applyitem', 'backendurl'],
// })

const ELFWrapperModalContainer = reactToWebComponent(ELFWrapperModal, React, ReactDOMClient, {
  props: ['applyitem', 'backendurl', 'buttontext', 'buttonclass'],
})

// 註冊 Web Components
// customElements.define('x-elf-wrapper', ELFWrapperContainer)
customElements.define('x-elf-wrapper-modal', ELFWrapperModalContainer)

export {
  // ELFWrapperContainer,
  ELFWrapperModalContainer }
