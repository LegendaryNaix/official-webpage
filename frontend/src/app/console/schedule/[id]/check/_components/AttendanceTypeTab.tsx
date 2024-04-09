'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttendanceStatus } from '@/lib/enums'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export default function AttendanceTypeTab() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleClick = (status: AttendanceStatus) => {
    const params = new URLSearchParams(searchParams)

    params.set('response', status)
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs defaultValue={AttendanceStatus.Present}>
      <TabsList>
        <TabsTrigger
          onClick={() => handleClick(AttendanceStatus.Present)}
          value={AttendanceStatus.Present}
        >
          참석
        </TabsTrigger>
        <TabsTrigger
          onClick={() => handleClick(AttendanceStatus.Tardy)}
          value={AttendanceStatus.Tardy}
        >
          부분참석
        </TabsTrigger>
        <TabsTrigger
          onClick={() => handleClick(AttendanceStatus.Absence)}
          value={AttendanceStatus.Absence}
        >
          불참
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
