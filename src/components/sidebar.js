'use client'

import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { useSharedContext } from '@/sharedContext'

import SidebarList from '@/components/sidebarList'
import { MenuProvider } from '@/contexts/MenuContext'

const Sidebar = () => {
  const [data, setData] = useState([])

  const { sharedValue } = useSharedContext()

  useEffect(() => {
    console.info('sidebar useEffect')
    const fetchData = async () => {
      try {
        const response = await fetch(`/bpm-elf/api/sidebar`)

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const result = await response.json()

        setData([
          { name: '歡迎', url: '/', icon: 'home' },
          ...result,
          {
            name: '建立模板',
            url: '/settings',
            icon: 'pencilSquare',
          },
        ])
      }
      catch (error) {
        toast.error(`Fetch error: ${error.message}`)
      }
    }

    fetchData()
  }, [sharedValue])

  return (
    <MenuProvider>
      <aside className="h-screen bg-white border-r border-gray-200 flex flex-col sidebar-dynamic-width">
        {/* 導覽列表 */}
        <nav className="pt-10 flex-1 overflow-y-auto">
          <SidebarList items={data} />
        </nav>
      </aside>
    </MenuProvider>
  )
}

export default Sidebar
