"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Content from "@/components/content";
import { toast } from "react-toastify";
import _ from "lodash";

const DynamicPage = () => {
  const router = useRouter();
  const [config, setConfig] = useState(null);
  useEffect(() => {
    if (!router.isReady || !router.query.applyItem) {
      return;
    }

    const fetchData = async () => {
      try {
        const { applyItem } = router.query;
        const basePath = router.basePath;

        // applyItem 如果是給子單.json 就要切成父 json 拿資料, /on-board_applyDevice.json => /on-board.json
        const pathArray = _.split(applyItem, "_");

        const response = await fetch(
          `${basePath}/api/read-setting/${pathArray[0]}.json`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let jsonData = await response.json();

        // 子單必須重組 json (基本資料+子單)
        if (pathArray.length > 1) {
          jsonData = {
            name: pathArray[1],
            tickets: jsonData.tickets.filter((item) =>
              ["基本資料", pathArray[1]].includes(item.title)
            ),
          };
        }

        setConfig(jsonData);
      } catch (error) {
        toast.error("Fetch error:", error.message);
      }
    };

    fetchData();
  }, [router.basePath, router.query, router.query.applyItem, router.isReady]);

  return <Content config={config} />;
};

export default DynamicPage;
