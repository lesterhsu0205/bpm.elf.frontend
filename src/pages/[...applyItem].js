'use client'

import Content from '@/components/content'
import { toast } from 'react-toastify'
import _ from 'lodash'

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// }

export async function getServerSideProps({ params }) {
  const { applyItem } = params
  console.info('applyItem: ' + applyItem)

  try {
    // FIXME: array index 應該以 sidebar 回傳 path array.length -1
    const data = await fetchData({ applyItem: applyItem[applyItem.length - 1] })

    return {
      props: { data },
      // revalidate: 1, // 若需要ISR，過期後新的 request 進來會撈新的資料，避免同一時刻過多使用者操作
    }
  }
  catch (error) {
    console.error('SSR fetch error:', error)
    return {
      props: { data: null },
    }
  }
}

const DynamicPage = ({ data }) => {
  // TODO: 這邊要檢查雜魚 path 就不給過
  console.info('load [applyItem].js')

  if (!data) {
    return <div>無法載入頁面資料</div>
  }

  return <Content config={data} />
}

const fetchData = async ({ applyItem }) => {
  console.info('fetch data')

  try {
    console.info(
      `url: ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/setting/${applyItem}.json`
    )

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/setting/${applyItem}.json`
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    let jsonData = await response.json()
    console.info('jsonData:' + JSON.stringify(jsonData))
    console.info('fetch data done')

    return jsonData
  }
  catch (error) {
    console.error('🔥 Fetch Error:', error)
    toast.error('Fetch error:', error.message)
    throw error // 重新拋出錯誤以便上層處理
  }
}

export default DynamicPage
