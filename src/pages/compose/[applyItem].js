"use client";

import Content from "@/components/content";
import { toast } from "react-toastify";
import _ from "lodash";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { applyItem } = params;
  console.info("applyItem: " + applyItem);

  const data = await fetchData({ applyItem });

  return {
    props: {
      data,
      revalidate: 1, // 若需要ISR，過期後新的 request 進來會撈新的資料，避免同一時刻過多使用者操作
    },
  };
}

const DynamicPage = ({ data }) => {
  console.info("load /compose/[applyItem].js");
  return <Content config={data} />;
};

const fetchData = async ({ applyItem }) => {
  console.info("fetch data");

  try {
    // applyItem 如果是給子單.json 就要切成父 json 拿資料, /on-board_applyDevice.json => /on-board.json
    const pathArray = _.split(applyItem, "_");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/read-setting/compose/${pathArray[0]}.json`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let jsonData = await response.json();

    // FIXME: compose 單內的子單必須重組 json (基本資料+子單)
    if (pathArray.length > 1) {
      jsonData = {
        name: pathArray[1],
        tickets: jsonData.tickets.filter((item) =>
          ["基本資料", pathArray[1]].includes(item.name)
        ),
      };
    } else {
      // 一般子單需用 tickets 包 for 前端頁面
      if (!jsonData.tickets) {
        jsonData = {
          name: jsonData.name,
          tickets: [jsonData],
        };
      }
    }

    console.info(jsonData);
    console.info("fetch data done");

    return jsonData;
  } catch (error) {
    toast.error("Fetch error:", error.message);
  }
};

export default DynamicPage;
