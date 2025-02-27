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

const Sidebar = () => {
  const [data, setData] = useState([]);
  const [accordionState, setAccordionState] = useState([]);

  const toggleAccordion = (index) => {
    setAccordionState((preState) => {
      const newState = [...preState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const { sharedValue } = useSharedContext();

  useEffect(() => {
    console.info("sidebar useEffect");
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/read-settings`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setData(result);
        setAccordionState(new Array(result.length).fill(false));
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

        {data.map((setting, index) => {
          let href = `/${_.replace(setting.file, ".json", "")}`;

          if (setting.isCompose === true) {
            href = `/compose${href}`
          }

          return (
            <Link key={`${setting.file}_${index}`} href={href}>
              {/* 透過傳參數去配對 json file 會顯示在 url 上，所以 json 命名應與 path name 一樣，如 /test -> test.json */}
              {/* href={{ pathname: "/test", param: { gg: "onboard" } }} */}
              <ListItem>
                <ListItemPrefix>
                  <TicketIcon className="h-5 w-5" />
                </ListItemPrefix>
                {setting.content.name}
              </ListItem>
            </Link>
          );
        })}

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
