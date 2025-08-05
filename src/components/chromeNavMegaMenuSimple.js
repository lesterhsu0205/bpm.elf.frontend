// components/chromeNavMegaMenuSimple.js - 簡化版本，不依賴 Material Tailwind
import React, { useState, useEffect } from 'react'
import {
  TicketIcon,
  HomeIcon,
  PresentationChartBarIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid'

const iconMap = {
  ticket: TicketIcon,
  home: HomeIcon,
  chart: PresentationChartBarIcon,
  pencilSquare: PencilSquareIcon,
}



// 手風琴式菜單項目組件
function AccordionMenuItems({ items, onItemClick, level = 0 }) {
  const [expandedIndex, setExpandedIndex] = useState(null)

  if (!items || !Array.isArray(items)) return null

  const handleToggle = (index) => {
    // 如果點擊的是已展開的項目，則收折；否則展開該項目並收折其他項目
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return items.map((item, index) => {
    const Icon = iconMap[item.icon]
    const hasChildren = Array.isArray(item.children) && item.children.length > 0
    const isExpanded = expandedIndex === index

    if (!hasChildren) {
      // 沒有子項目，直接渲染可點擊項目
      return (
        <button
          key={`${level}-${index}`}
          className="dropdown-item d-flex align-items-center gap-2 border-0 bg-transparent p-2"
          onClick={() => onItemClick(item)}
          style={{ cursor: 'pointer' }}
        >
          {Icon && <Icon className="text-primary" style={{ width: '20px', height: '20px' }} />}
          <div>
            <div className="fw-bold small">{item.name}</div>
            {item.description && (
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {item.description}
              </div>
            )}
          </div>
        </button>
      )
    }

    // 有子項目，渲染可收折的項目
    return (
      <div key={`${level}-${index}`}>
        <button
          className="dropdown-item d-flex align-items-center justify-content-between gap-2 p-2 bg-light border-0"
          onClick={() => handleToggle(index)}
          style={{ cursor: 'pointer', width: '100%' }}
        >
          <div className="d-flex align-items-center gap-2">
            {Icon && <Icon className="text-secondary" style={{ width: '20px', height: '20px' }} />}
            <div className="fw-bold small text-secondary">{item.name}</div>
          </div>
          <ChevronDownIcon 
            style={{ 
              width: '16px', 
              height: '16px',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} 
            className="text-secondary"
          />
        </button>
        
        {/* 手風琴式收折的子項目 */}
        {isExpanded && (
          <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #e9ecef' }}>
            <AccordionMenuItems items={item.children} onItemClick={onItemClick} level={level + 1} />
          </div>
        )}
      </div>
    )
  })
}

// 遞迴渲染菜單項目（保留原來的簡單版本作為備用）
function renderMenuItems(items, onItemClick, level = 0) {
  return <AccordionMenuItems items={items} onItemClick={onItemClick} level={level} />
}

// 主要的簡化 Mega Menu 組件
export default function ChromeNavMegaMenuSimple({ onItemSelect, onManualInput, backendurl }) {
  const [navigationData, setNavigationData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [manualInputValue, setManualInputValue] = useState('')

  // 從 API 載入導航數據
  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 使用與 sidebar 相同的 API 端點，但適配到 chrome component 的 backendurl
        const apiUrl = backendurl 
          ? `${backendurl}/api/sidebar` 
          : `/bpm-elf/api/sidebar`
        
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error('載入導航數據失敗')
        }

        const result = await response.json()

        // 使用 API 回傳的原始數據，不添加額外項目
        const combinedData = result

        setNavigationData(combinedData)
      } catch (err) {
        console.error('載入導航數據錯誤:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNavigationData()
  }, [backendurl])

  // 處理項目選擇
  const handleItemClick = (item) => {
    console.info('🔗 選擇導航項目:', item)
    setIsMenuOpen(false)
    
    // 提取 applyitem（如果 url 存在的話）
    if (item.url) {
      // 從 URL 中提取 applyitem
      const urlParts = item.url.split('/').filter(Boolean)
      const applyitem = urlParts[urlParts.length - 1]
      
      if (applyitem && onItemSelect) {
        onItemSelect(applyitem, item.name) // 傳遞 item name
      }
    }
  }

  // 處理手動輸入
  const handleManualInputSubmit = () => {
    if (!manualInputValue.trim()) return
    
    setIsMenuOpen(false)
    if (onManualInput) {
      onManualInput(manualInputValue.trim())
    }
    setManualInputValue('')
  }

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualInputSubmit()
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom mb-3">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1 d-flex align-items-center">
          <img 
            src="magician-hat512.png"
            alt="BPM ELF Logo" 
            style={{ width: '32px', height: '32px', marginRight: '8px' }}
          />
          BPM ELF
        </span>
        
        <div className="navbar-nav">
          <div className="nav-item dropdown">
            <button
              className="nav-link btn btn-link border-0 d-flex align-items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              disabled={loading}
            >
              {loading ? '載入中...' : '導航選單'}
              <ChevronDownIcon 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  marginLeft: '0.5rem',
                  transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </button>
            
            {/* Dropdown Menu */}
            <div 
              className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}
              style={{ 
                minWidth: '300px',
                maxHeight: '400px',
                overflowY: 'auto',
                position: 'absolute',
                top: '100%',
                right: '0',
                zIndex: 1000
              }}
            >
              {loading && (
                <div className="dropdown-item-text text-center p-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">載入中...</span>
                  </div>
                  <div className="mt-2">載入導航中...</div>
                </div>
              )}
              
              {error && (
                <div className="dropdown-item-text text-danger p-3">
                  <strong>錯誤:</strong> {error}
                </div>
              )}
              
              {!loading && !error && navigationData.length > 0 && (
                <div className="p-2">
                  {renderMenuItems(navigationData, handleItemClick)}
                  
                  {/* 分隔線 */}
                  <hr className="my-2" />
                  
                  {/* 手動輸入區域 */}
                  <div className="p-2 bg-light rounded">
                    <div className="fw-bold small text-secondary mb-2">手動輸入 ApplyItem</div>
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如: your-apply-item"
                        value={manualInputValue}
                        onChange={(e) => setManualInputValue(e.target.value)}
                        onKeyPress={handleInputKeyPress}
                      />
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={handleManualInputSubmit}
                        disabled={!manualInputValue.trim()}
                      >
                        載入
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {!loading && !error && navigationData.length === 0 && (
                <div className="p-3">
                  <div className="dropdown-item-text text-muted mb-2">
                    無可用的導航項目
                  </div>
                  
                  {/* 只有手動輸入的情況 */}
                  <div className="p-2 bg-light rounded">
                    <div className="fw-bold small text-secondary mb-2">手動輸入 ApplyItem</div>
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="例如: your-apply-item"
                        value={manualInputValue}
                        onChange={(e) => setManualInputValue(e.target.value)}
                        onKeyPress={handleInputKeyPress}
                      />
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={handleManualInputSubmit}
                        disabled={!manualInputValue.trim()}
                      >
                        載入
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 點擊外部關閉選單的覆蓋層 */}
      {isMenuOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 999 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  )
}
