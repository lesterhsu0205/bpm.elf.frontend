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
      <Nav.Link as={Link} href="/onBoard">
        新人報到
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link as={Link} href="/system">
        系統申請
      </Nav.Link>
    </Nav.Item>
  </Nav>
);

export default Sidebar;
