import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/settings/none') // 自動導向 /settings/none
  })

  return <div>載入中...</div> // 可放 Loading 畫面
}
