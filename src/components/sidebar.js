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
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Nav } from "react-bootstrap";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const [data, setData] = useState([]);

  const router = useRouter();

  useEffect(() => {
    console.info("sidebar useEffect");
    if (!router.isReady) {
      return;
    }
    const fetchData = async () => {
      const basePath = router.basePath;
      try {
        const response = await fetch(`${basePath}/api/read-settings`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        toast.error("Fetch error:", error.message);
      }
    };

    fetchData();
  }, [router.isReady, router.basePath]);

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
          if (setting.content.hidden && setting.content.hidden === true) {
            return (
              <React.Fragment key={`${setting.file}_${index}`}></React.Fragment>
            );
          }

          return (
            <Link
              key={`${setting.file}_${index}`}
              href={`/${_.replace(setting.file, ".json", "")}`}
            >
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
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <RectangleStackIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                其他工具
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-0 px-3">
            <List className="p-0">
              <Link href="/maintain-mail">
                <ListItem>
                  {/* <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix> */}
                  <ListItemPrefix>
                    <ArrowTurnDownRightIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  上版維運信
                </ListItem>
              </Link>

              <Link href="/apply-interface-approve">
                <ListItem>
                  <ListItemPrefix>
                    <ArrowTurnDownRightIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Release單簽核
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>

        {/* <ListItem>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem> */}
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

    // <Nav className="sidebar bg-light flex-column p-3">

    //   {data.map((setting, index) => (
    //     <Nav.Item key={`${setting.file}_${index}`}>
    //       <Nav.Link as={Link} href={`/${_.replace(setting.file, ".json", "")}`}>
    //         {/* 透過傳參數去配對 json file 會顯示在 url 上，所以 json 命名應與 path name 一樣，如 /test -> test.json */}
    //         {/* href={{ pathname: "/test", param: { gg: "onboard" } }} */}
    //         {setting.content.name}
    //       </Nav.Link>
    //     </Nav.Item>
    //   ))}
    // </Nav>
  );
};

export default Sidebar;
