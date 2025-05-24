// components/SidebarItem.jsx
import {
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  TicketIcon,
  PresentationChartBarIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import SidebarList from "@/components/sidebarList";

export default function SidebarItem({ item, level, isOpen, onToggle }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const paddingLeft = `${level * 0.3}rem`; // 1.25rem = 20px

  const iconMap = {
    ticket: TicketIcon,
    home: HomeIcon,
    // ...
  };

  const Icon = iconMap[item.icon];

  if (!hasChildren) {
    // 單一節點，直接用 ListItem + Link
    return (
      <div style={{ paddingLeft }}>
        <Link href={item.url || "/"}>
          <ListItem>
            {Icon && (
              <ListItemPrefix>
                <Icon className="h-5 w-5" />
              </ListItemPrefix>
            )}
            {item.name}
          </ListItem>
        </Link>
      </div>
    );
  }

  // 含子項目：用 Accordion 包裹，遞迴渲染 children
  return (
    <div style={{ paddingLeft }}>
      <Accordion
        open={isOpen}
        icon={
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`mx-auto h-4 w-4 transition-transform ${
              isOpen ? "" : "rotate-90"
            }`}
          />
        }
      >
        <ListItem className="p-0" selected={isOpen}>
          <AccordionHeader onClick={onToggle} className="border-b-0 p-3">
            {Icon && (
              <ListItemPrefix>
                <Icon className="h-5 w-5" />
              </ListItemPrefix>
            )}
            <Typography color="blue-gray" className="mr-auto font-normal">
              {item.name}
            </Typography>
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          {/* 遞迴至下一層清單 */}
          <SidebarList items={item.children} level={level + 1} />
        </AccordionBody>
      </Accordion>
    </div>
  );
}
