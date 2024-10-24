"use client";

import { useEffect, useState } from "react";

const Placeholder = () => <div>Loading Editor...</div>;

const JsonEditor = ({ data, setData }) => {
  const [Editor, setEditor] = useState(() => Placeholder);

  useEffect(() => {
    async function loadLibary() {
      const mod = await import("json-edit-react");
      setEditor(() => mod.JsonEditor);
    }
    loadLibary();
  }, []);

  return (
    <Editor
      data={data}
      setData={setData} // optional
      rootName=""
      // collapse={3}
      showCollectionCount="when-closed"
      maxWidth="100%"
    />
  );
};

export default JsonEditor;
