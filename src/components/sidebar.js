"use client";

import React, { useEffect, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { useSharedContext } from "@/sharedContext";

import SidebarList from "@/components/sidebarList";

const Sidebar = () => {
  const [data, setData] = useState([]);

  const { sharedValue } = useSharedContext();

  useEffect(() => {
    console.info("sidebar useEffect");
    const fetchData = async () => {
      try {
        const response = await fetch(`/bpm-elf/api/sidebar`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setData([
          { name: "首頁", url: "/", icon: "home" },
          ...result,
          {
            name: "設定",
            url: "/settings",
            icon: "pencilSquare",
          },
        ]);
      } catch (error) {
        toast.error(`Fetch error: ${error.message}`);
      }
    };

    fetchData();
  }, [sharedValue]);

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* 導覽列表 */}
      <nav className="pt-10 flex-1 overflow-y-auto">
        <SidebarList items={data} />
      </nav>
    </aside>
  );
};

export default Sidebar;
