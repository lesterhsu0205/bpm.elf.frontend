// components/SidebarItem.js
"use client";

import { useState } from "react";
import { Menu, MenuHandler, MenuList } from "@material-tailwind/react";
import {
  TicketIcon,
  HomeIcon,
  PresentationChartBarIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import SidebarList from "@/components/sidebarList";

const iconMap = {
  ticket: TicketIcon,
  home: HomeIcon,
  chart: PresentationChartBarIcon,
  pencilSquare: PencilSquareIcon,
  home: HomeIcon,
  // …你原本的 iconMap
};

export default function SidebarItem({ item }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const [open, setOpen] = useState(false);
  const Icon = iconMap[item.icon];

  // 共同的文字＋圖示排版 class
  const baseClass = `
    flex items-center justify-between
    w-full text-left
    px-4 py-2 rounded-md
    text-gray-700 hover:bg-gray-100
    focus:outline-none focus:ring-0
    active:bg-transparent
  `;

  // **無子節點**：純連結
  if (!hasChildren) {
    return (
      <Link href={item.url || "#"} className={`${baseClass}`}>
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-gray-500 mr-3" />}
          <span>{item.name}</span>
        </div>
      </Link>
    );
  }

  // **有子節點**：滑鼠懸停或點擊自動在右側展開
  return (
    <Menu
      placement="right-start"
      allowHover
      open={open}
      handler={setOpen}
      offset={4}
    >
      <MenuHandler>
        <button className={`${baseClass}`} type="button">
          <div className="flex items-center">
            {Icon && <Icon className="h-5 w-5 text-gray-500 mr-3" />}
            <span>{item.name}</span>
          </div>
        </button>
      </MenuHandler>
      <MenuList className="border border-gray-200 bg-white shadow-lg">
        {/* 遞迴渲染下一層 */}
        <SidebarList items={item.children} />
      </MenuList>
    </Menu>
  );
}
