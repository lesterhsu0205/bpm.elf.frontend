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
import { useRouter } from "next/router";
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

  const router = useRouter();

  const { sharedValue } = useSharedContext();

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
        setAccordionState(new Array(result.length).fill(false));
      } catch (error) {
        toast.error(`Fetch error: ${error.message}`);
      }
    };

    fetchData();
  }, [router.isReady, router.basePath, sharedValue]);

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
          if (setting.content.tickets.length < 2) {
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
          } else {
            return (
              <Accordion
                key={`${setting.file}_${index}`}
                open={accordionState[index]}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      accordionState[index] ? "" : "rotate-90"
                    }`}
                  />
                }
              >
                <Link href={`/${_.replace(setting.file, ".json", "")}`}>
                  <ListItem className="p-0" selected={accordionState[index]}>
                    <AccordionHeader
                      onClick={() => toggleAccordion(index)}
                      className="border-b-0 p-3"
                    >
                      <ListItemPrefix>
                        <TicketIcon className="h-5 w-5" />
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className="mr-auto font-normal"
                      >
                        {setting.content.name}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                </Link>

                <AccordionBody className="py-0 px-3">
                  <List className="p-0">
                    {setting.content.tickets.map((ticket, idx) => {
                      // FIXME: 識別不要用"基本資料"
                      if (ticket.title === "基本資料") {
                        return (
                          <React.Fragment
                            key={`${ticket.title}_${idx}`}
                          ></React.Fragment>
                        );
                      }
                      return (
                        <Link
                          href={`/${_.replace(setting.file, ".json", "")}_${
                            ticket.title
                          }`}
                          key={`${ticket.title}_${idx}`}
                        >
                          <ListItem>
                            {/* <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix> */}
                            <ListItemPrefix>
                              <ArrowTurnDownRightIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            {ticket.title}
                          </ListItem>
                        </Link>
                      );
                    })}
                  </List>
                </AccordionBody>
              </Accordion>
            );
          }
        })}

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
  );
};

export default Sidebar;
