// components/SidebarItem.js
'use client'

import { useRef, useEffect } from 'react'
import {
  TicketIcon,
  HomeIcon,
  PresentationChartBarIcon,
  PencilSquareIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'
import Link from 'next/link'
import SidebarList from '@/components/sidebarList'
import { useMenu } from '@/contexts/MenuContext'

const iconMap = {
  ticket: TicketIcon,
  home: HomeIcon,
  chart: PresentationChartBarIcon,
  pencilSquare: PencilSquareIcon,
  home: HomeIcon,
  // …你原本的 iconMap
}

export default function SidebarItem({ item, path = '' }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0
  const menuId = path ? `${path}.${item.name}` : item.name
  const Icon = iconMap[item.icon]
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  
  const {
    openMenu,
    closeMenuDelayed,
    isMenuOpen,
    isMenuVisible,
    getMenuPosition,
    hasOpenChildMenu,
    clearMenuTimeouts
  } = useMenu()
  
  const isOpen = isMenuOpen(menuId)
  const isVisible = isMenuVisible(menuId)
  const menuPosition = getMenuPosition(menuId)

  // 共同的文字＋圖示排版 class
  const baseClass = `
    flex items-center justify-between
    w-full text-left
    px-4 py-2 rounded-md
    text-gray-700 hover:bg-gray-100
    focus:outline-none focus:ring-0
    active:bg-transparent
  `

  // 處理滑鼠懸停邏輯
  const handleMouseEnter = () => {
    if (hasChildren && buttonRef.current) {
      // 清除當前選單的所有 timeout
      clearMenuTimeouts(menuId)
      
      // 計算選單位置
      const rect = buttonRef.current.getBoundingClientRect()
      const position = {
        top: rect.top,
        left: rect.right + 5
      }
      
      openMenu(menuId, position)
    }
  }

  const handleMouseLeave = () => {
    if (hasChildren) {
      // 檢查是否有子選單開啟，如果有則延遲關閉
      if (hasOpenChildMenu(menuId)) {
        // 有子選單開啟，延遲關閉以允許用戶移動到子選單
        closeMenuDelayed(menuId, 200)
      } else {
        // 沒有子選單，較短延遲關閉
        closeMenuDelayed(menuId, 100)
      }
    }
  }

  const handleMenuMouseEnter = () => {
    // 當滑鼠進入子選單時，取消關閉當前選單
    clearMenuTimeouts(menuId)
    
    if (hasChildren && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const position = {
        top: rect.top,
        left: rect.right + 5
      }
      openMenu(menuId, position)
    }
  }

  const handleMenuMouseLeave = () => {
    // 當滑鼠離開子選單時，開始關閉流程
    closeMenuDelayed(menuId, 50)
  }

  // 清理 effect
  useEffect(() => {
    return () => {
      clearMenuTimeouts(menuId)
    }
  }, [clearMenuTimeouts, menuId])

  // **無子節點**：純連結
  if (!hasChildren) {
    return (
      <Link 
        href={item.url || '#'} 
        className={`${baseClass}`}
      >
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-gray-500 mr-3" />}
          <span className="sidebar-item-text" title={item.name}>{item.name}</span>
        </div>
      </Link>
    )
  }

  // **有子節點**：自定義懸浮選單
  return (
    <div className="relative">
      <button 
        ref={buttonRef}
        className={`${baseClass}`} 
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (isOpen) {
            closeMenuDelayed(menuId, 0)
          } else {
            handleMouseEnter()
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-gray-500 mr-3" />}
          <span className="sidebar-item-text" title={item.name}>{item.name}</span>
        </div>
        <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-3" />
      </button>
      
      {/* 自定義下拉選單 */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="fixed border border-gray-200 rounded-lg shadow-lg py-1 min-w-max"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
          style={{ 
            position: 'fixed',
            left: `${menuPosition.left}px`,
            top: `${menuPosition.top}px`,
            zIndex: 9999,
            minWidth: '200px',
            backgroundColor: '#f9fafb', // 更柔和的背景色，匹配 sidebar 的 gray-50
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 200ms ease-in-out',
            pointerEvents: isVisible ? 'auto' : 'none'
          }}
        >
          <SidebarList items={item.children} path={menuId} />
        </div>
      )}
    </div>
  )
}
