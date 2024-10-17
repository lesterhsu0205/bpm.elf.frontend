"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Content from "@/components/content";

const DynamicPage = () => {
  const router = useRouter();
  const [config, setConfig] = useState(null);
  useEffect(() => {

    if (!router.isReady || !router.query.applyItem) {
      return
    }

    // TODO: 或許可改成每分鐘重新 fetch 一次
    const fetchData = async () => {
      try {
        const { applyItem } = router.query;
        const basePath = router.basePath;
        const response = await fetch(`${basePath}/${applyItem}.json`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();

        setConfig(jsonData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [router.basePath, router.query, router.query.applyItem, router.isReady]);

  return <Content config={config} />;
};

export default DynamicPage;
