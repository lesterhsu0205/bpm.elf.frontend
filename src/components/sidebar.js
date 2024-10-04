import { Nav } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _ from "lodash"

const Sidebar = () => {
  const [data, setData] = useState([]);

  const router = useRouter();

  useEffect(() => {
    console.info("shit");
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
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [router.isReady, router.basePath]);

  return (
    <Nav className="sidebar bg-light flex-column p-3">
      <Nav.Item>
        <Nav.Link as={Link} href="/">
          Home
        </Nav.Link>
      </Nav.Item>

      {data.map((setting, index) => (
        <Nav.Item key={`${setting.file}_${index}`}>
          <Nav.Link as={Link} href={`/${_.replace(setting.file, ".json", "")}`}>
            {/* 透過傳參數去配對 json file 會顯示在 url 上，所以 json 命名應與 path name 一樣，如 /test -> test.json */}
            {/* href={{ pathname: "/test", param: { gg: "onboard" } }} */}
            {setting.content.name}
          </Nav.Link>
        </Nav.Item>
      ))}
      <Nav.Item>
        <Nav.Link as={Link} href="/settings">
          設定
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;
