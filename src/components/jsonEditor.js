'use client'

import { JsonEditor as Editor } from 'json-edit-react'
import { useRouter } from 'next/router'

const Placeholder = () => <div>載入 JSON 編輯器...</div>

const JsonEditor = ({ data, setData, onUpdate }) => {
  const router = useRouter()
  // 檢查是否為 /new 頁面
  const isNewPage = router.pathname.includes('/settings/[applyItem]') && router.query.applyItem === 'new'
  
  return (
    <Editor
      data={data}
      setData={setData}
      rootName=""
      showCollectionCount="when-closed"
      maxWidth="100%"
      onUpdate={onUpdate}
      showArrayIndices={false}
      showIconTooltips={true}
      viewOnly={!isNewPage}
    />
  )
}

export default JsonEditor
