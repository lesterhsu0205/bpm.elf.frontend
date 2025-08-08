'use client'

import { useEffect, useState } from 'react'

const Placeholder = () => <div>載入 JSON 編輯器...</div>

const JsonEditor = ({ data, setData, onUpdate }) => {
  const [Editor, setEditor] = useState(() => Placeholder)

  useEffect(() => {
    async function loadLibrary() {
      const mod = await import('json-edit-react')
      setEditor(() => mod.JsonEditor)
    }
    loadLibrary()
  }, [])

  return (
    <Editor
      data={data}
      setData={setData} // optional
      rootName=""
      // collapse={3}
      showCollectionCount="when-closed"
      maxWidth="100%"
      onUpdate={onUpdate}
    />
  )
}

export default JsonEditor
