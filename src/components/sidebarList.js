// components/SidebarList.js
import React, { forwardRef } from 'react'
import SidebarItem from '@/components/sidebarItem'

const SidebarList = forwardRef(function SidebarList({ items }, ref) {
  return (
    items
    && items.length > 0 && (
      <ul ref={ref} className="space-y-1 focus:outline-none">
        {items.map((item, idx) => (
          <li key={idx}>
            <SidebarItem key={idx} item={item} />
          </li>
        ))}
      </ul>
    )
  )
})

export default SidebarList
