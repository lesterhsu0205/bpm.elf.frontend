"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Content from "@/components/content";
import { toast } from "react-toastify";
import _ from "lodash";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps() {
  return { props: {} };
}

const DynamicPage = () => {
  console.info("load [applyItem].js");

  const router = useRouter();
  const [config, setConfig] = useState(null);
  useEffect(() => {
    console.info("useEffect in [applyItem].js");

    if (!router.isReady || !router.query.applyItem) {
      console.info("!router.isReady: " + !router.isReady);
      console.info("!router.query.applyItem: " + !router.query.applyItem);
      return;
    }

    const fetchData = async () => {
      console.info("fetch data");

      try {
        const { applyItem } = router.query;

        // applyItem 如果是給子單.json 就要切成父 json 拿資料, /on-board_applyDevice.json => /on-board.json
        const pathArray = _.split(applyItem, "_");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/read-setting/${pathArray[0]}.json`
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

        console.info("fetch data done");
      } catch (error) {
        toast.error("Fetch error:", error.message);
      }
    };

    fetchData();
  }, [router.query, router.query.applyItem, router.isReady]);

  return <Content config={config} />;
};

export default DynamicPage;
