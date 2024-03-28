'use client'

import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/vars'
import { SheetIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DownloadExcelButton({
  scheduleId
}: {
  scheduleId: number
}) {
  const [isFecthing, setIsFecthing] = useState(false)

  const handleDownloadExcel = async () => {
    try {
      setIsFecthing(true)

      const session = await auth()

      const response = await fetch(
        API_BASE_URL + `/attendances/excel-file?scheduleId=${scheduleId}`,
        {
          headers: {
            Authorization: session?.token.accessToken ?? ''
          }
        }
      )
      const blob = await response.blob()

      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', '출석조사 결과.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      toast.error('다운로드 실패')
    } finally {
      setIsFecthing(false)
    }
  }

  return (
    <Button
      disabled={isFecthing}
      variant="accent"
      onClick={() => handleDownloadExcel()}
    >
      <SheetIcon className="mr-1 h-5 w-5" /> 엑셀파일로 내보내기
    </Button>
  )
}
