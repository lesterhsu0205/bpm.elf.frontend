// components/Sidebar.js
import { Nav } from "react-bootstrap";
import Link from "next/link";

const Sidebar = () => (
  <Nav className="sidebar bg-light flex-column p-3">
    <Nav.Item>
      <Nav.Link as={Link} href="/">
        Home
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link
        as={Link}
        // 透過傳參數去配對 json file 會顯示在 url 上，所以 json 命名應與 path name 一樣，如 /test -> test.json
        href="/onBoard"
        // href={{ pathname: "/test", param: { gg: "onBoard" } }}
      >
        新人到職申請
      </Nav.Link>
    </Nav.Item>
  </Nav>
);

export default Sidebar;
