'use client'

import React, { createContext, useContext, useState, useRef, useCallback } from 'react'

const MenuContext = createContext()

export function MenuProvider({ children }) {
  const [openMenus, setOpenMenus] = useState(new Map()) // menuId -> { isOpen, isVisible, position }
  const timeoutRefs = useRef(new Map()) // menuId -> timeoutRef
  const fadeTimeoutRefs = useRef(new Map()) // menuId -> fadeTimeoutRef

  // 清除指定選單的所有 timeout
  const clearMenuTimeouts = useCallback((menuId) => {
    if (timeoutRefs.current.has(menuId)) {
      clearTimeout(timeoutRefs.current.get(menuId))
      timeoutRefs.current.delete(menuId)
    }
    if (fadeTimeoutRefs.current.has(menuId)) {
      clearTimeout(fadeTimeoutRefs.current.get(menuId))
      fadeTimeoutRefs.current.delete(menuId)
    }
  }, [])

  // 清除所有 timeout
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    fadeTimeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current.clear()
    fadeTimeoutRefs.current.clear()
  }, [])

  // 開啟選單
  const openMenu = useCallback((menuId, position) => {
    clearMenuTimeouts(menuId)
    setOpenMenus(prev => new Map(prev).set(menuId, {
      isOpen: true,
      isVisible: true,
      position
    }))
  }, [clearMenuTimeouts])

  // 關閉選單（立即）
  const closeMenu = useCallback((menuId) => {
    clearMenuTimeouts(menuId)
    setOpenMenus(prev => {
      const newMap = new Map(prev)
      newMap.delete(menuId)
      return newMap
    })
  }, [clearMenuTimeouts])

  // 延遲關閉選單
  const closeMenuDelayed = useCallback((menuId, delay = 100) => {
    const timeoutId = setTimeout(() => {
      setOpenMenus(prev => {
        const current = prev.get(menuId)
        if (current) {
          const newMap = new Map(prev)
          newMap.set(menuId, { ...current, isVisible: false })
          return newMap
        }
        return prev
      })
      
      // 淡出動畫完成後完全關閉
      const fadeTimeoutId = setTimeout(() => {
        setOpenMenus(prev => {
          const newMap = new Map(prev)
          newMap.delete(menuId)
          return newMap
        })
        fadeTimeoutRefs.current.delete(menuId)
      }, 200)
      
      fadeTimeoutRefs.current.set(menuId, fadeTimeoutId)
      timeoutRefs.current.delete(menuId)
    }, delay)
    
    timeoutRefs.current.set(menuId, timeoutId)
  }, [])

  // 檢查選單是否開啟
  const isMenuOpen = useCallback((menuId) => {
    return openMenus.has(menuId) && openMenus.get(menuId)?.isOpen
  }, [openMenus])

  // 檢查選單是否可見
  const isMenuVisible = useCallback((menuId) => {
    return openMenus.has(menuId) && openMenus.get(menuId)?.isVisible
  }, [openMenus])

  // 取得選單位置
  const getMenuPosition = useCallback((menuId) => {
    return openMenus.get(menuId)?.position || { top: 0, left: 0 }
  }, [openMenus])

  // 檢查是否有任何子選單開啟
  const hasOpenChildMenu = useCallback((parentPath) => {
    for (const menuId of openMenus.keys()) {
      if (menuId.startsWith(parentPath + '.') && openMenus.get(menuId)?.isOpen) {
        return true
      }
    }
    return false
  }, [openMenus])

  const value = {
    openMenu,
    closeMenu,
    closeMenuDelayed,
    isMenuOpen,
    isMenuVisible,
    getMenuPosition,
    hasOpenChildMenu,
    clearMenuTimeouts,
    clearAllTimeouts
  }

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}