"use client";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  QueueListIcon,
  PencilSquareIcon,
  TicketIcon,
  RectangleStackIcon,
  PresentationChartBarIcon,
  AdjustmentsHorizontalIcon,
  ArrowTurnDownRightIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { useSharedContext } from "@/sharedContext";

import SidebarList from "@/components/sidebarList";

const Sidebar = () => {
  const [data, setData] = useState([]);

  const { sharedValue } = useSharedContext();

  // 本層級唯一的開合狀態，用項目索引管理
  const [openId, setOpenId] = useState(null); // 同層打開即關閉其他

  useEffect(() => {
    console.info("sidebar useEffect");
    const fetchData = async () => {
      try {
        const response = await fetch(`/bpm-elf/api/sidebar`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        toast.error(`Fetch error: ${error.message}`);
      }
    };

    fetchData();
  }, [sharedValue]);

  return (
    <Card className="shadow-xl h-full overflow-y-auto">
      <List>
        <Link href="/">
          <ListItem>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            首頁
          </ListItem>
        </Link>

        <SidebarList items={data} level={0} />

        <hr className="my-2 border-blue-gray" />

        <Link href="/settings">
          <ListItem>
            <ListItemPrefix>
              <PencilSquareIcon className="h-5 w-5" />
            </ListItemPrefix>
            設定
          </ListItem>
        </Link>
      </List>
    </Card>
  );
};

export default Sidebar;
