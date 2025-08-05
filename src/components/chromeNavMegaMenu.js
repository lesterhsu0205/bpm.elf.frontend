// components/chromeNavMegaMenu.js
import React, { useState, useEffect } from 'react'
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react'
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  TicketIcon,
  HomeIcon,
  PresentationChartBarIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'

const iconMap = {
  ticket: TicketIcon,
  home: HomeIcon,
  chart: PresentationChartBarIcon,
  pencilSquare: PencilSquareIcon,
}

// 遞迴渲染菜單項目
function renderMenuItems(items, onItemClick, level = 0) {
  if (!items || !Array.isArray(items)) return null

  return items.map((item, index) => {
    const Icon = iconMap[item.icon]
    const hasChildren = Array.isArray(item.children) && item.children.length > 0
    
    // 如果沒有子項目，直接渲染為可點擊項目
    if (!hasChildren) {
      return (
        <MenuItem
          key={`${level}-${index}`}
          className="flex items-center gap-3 rounded-lg cursor-pointer hover:bg-blue-gray-50"
          onClick={() => onItemClick(item)}
        >
          <div className="flex items-center justify-center rounded-lg bg-blue-gray-50 p-2">
            {Icon && React.createElement(Icon, {
              strokeWidth: 2,
              className: "h-6 text-gray-900 w-6",
            })}
          </div>
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="flex items-center text-sm font-bold"
            >
              {item.name}
            </Typography>
            {item.description && (
              <Typography
                variant="paragraph"
                className="text-xs !font-medium text-blue-gray-500"
              >
                {item.description}
              </Typography>
            )}
          </div>
        </MenuItem>
      )
    }

    // 如果有子項目，渲染為包含子菜單的項目
    return (
      <div key={`${level}-${index}`} className="w-full">
        <MenuItem className="flex items-center gap-3 rounded-lg opacity-50 cursor-not-allowed">
          <div className="flex items-center justify-center rounded-lg bg-blue-gray-50 p-2">
            {Icon && React.createElement(Icon, {
              strokeWidth: 2,
              className: "h-6 text-gray-900 w-6",
            })}
          </div>
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="flex items-center text-sm font-bold"
            >
              {item.name} (分類)
            </Typography>
          </div>
        </MenuItem>
        {/* 遞迴渲染子項目 */}
        <div className="ml-4 border-l border-gray-200 pl-4">
          {renderMenuItems(item.children, onItemClick, level + 1)}
        </div>
      </div>
    )
  })
}

// 頂層菜單項目組件
function NavListMenu({ items, onItemClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 處理項目點擊
  const handleItemClick = (item) => {
    setIsMenuOpen(false)
    setIsMobileMenuOpen(false)
    onItemClick(item)
  }

  const menuItems = renderMenuItems(items, handleItemClick)

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900 hover:bg-blue-gray-50 cursor-pointer"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              導航選單
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block p-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 gap-y-2 outline-none outline-0">
            {menuItems}
          </div>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>
          <div className="p-4 max-h-96 overflow-y-auto">
            {menuItems}
          </div>
        </Collapse>
      </div>
    </React.Fragment>
  )
}

// 導航列表組件
function NavList({ navigationData, onItemClick, loading, error }) {
  if (loading) {
    return (
      <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
        <Typography variant="small" color="blue-gray" className="font-medium">
          <ListItem className="flex items-center gap-2 py-2 pr-4">
            載入導航中...
          </ListItem>
        </Typography>
      </List>
    )
  }

  if (error) {
    return (
      <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
        <Typography variant="small" color="red" className="font-medium">
          <ListItem className="flex items-center gap-2 py-2 pr-4">
            載入導航失敗
          </ListItem>
        </Typography>
      </List>
    )
  }

  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <NavListMenu items={navigationData} onItemClick={onItemClick} />
    </List>
  )
}

// 主要的 Mega Menu 組件
export default function ChromeNavMegaMenu({ onItemSelect, backendurl }) {
  const [openNav, setOpenNav] = useState(false)
  const [navigationData, setNavigationData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

        // 組合導航數據（與 sidebar.js 保持一致）
        const combinedData = [ 
          ...result
        ]

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
    
    // 提取 applyitem（如果 url 存在的話）
    if (item.url) {
      // 從 URL 中提取 applyitem
      const urlParts = item.url.split('/').filter(Boolean)
      const applyitem = urlParts[urlParts.length - 1]
      
      if (applyitem && onItemSelect) {
        onItemSelect(applyitem)
      }
    }
  }

  // 響應式處理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Navbar className="mx-auto max-w-full px-4 py-2 mb-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2 font-bold"
        >
          BPM ELF
        </Typography>
        <div className="hidden lg:block">
          <NavList 
            navigationData={navigationData} 
            onItemClick={handleItemClick}
            loading={loading}
            error={error}
          />
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList 
          navigationData={navigationData} 
          onItemClick={handleItemClick}
          loading={loading}
          error={error}
        />
      </Collapse>
    </Navbar>
  )
}
