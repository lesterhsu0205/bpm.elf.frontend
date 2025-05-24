// components/SidebarList.jsx
import { useState } from "react";
import { List } from "@material-tailwind/react";
import SidebarItem from "@/components/sidebarItem";

export default function SidebarList({ items, level = 0 }) {
  // 本層級唯一的開合狀態，用項目索引管理
  const [openId, setOpenId] = useState(null); // 同層打開即關閉其他【 [oai_citation:7‡GeeksforGeeks](https://www.geeksforgeeks.org/lifting-state-up-in-reactjs/?utm_source=chatgpt.com)】

  return (
    items.length > 0 && (
      <List className="p-0">
        {items.map((item, idx) => (
          <SidebarItem
            key={idx}
            item={item}
            level={level}
            isOpen={openId === idx} // 受控展開狀態【】
            onToggle={() => {
              // 點擊同一項則關閉，否則打開此項
              setOpenId(openId === idx ? null : idx);
            }}
          />
        ))}
      </List>
    )
  );
}
