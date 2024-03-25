'use client'

import Badge, { BadgeColor } from '@/components/Badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AttendanceStatus } from '@/lib/enums'
import fetcher from '@/lib/fetcher'
import type { AttendanceListItem } from '@/lib/types/attendance'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AttendanceCheckCard({
  attendance
}: {
  attendance: AttendanceListItem
}) {
  const [isFethcing, setIsFetching] = useState(false)
  const router = useRouter()

  const handleClick = async (result: AttendanceStatus) => {
    try {
      setIsFetching(true)
      await fetcher.put(`/attendances/${attendance.id}`, { result }, false)
      toast.success('출석체크 성공')
      router.refresh()
    } catch (error) {
      toast.error('출석체크 실패')
    } finally {
      setIsFetching(false)
    }
  }

  const renderAttendanceStatus = (attendance: AttendanceListItem) => {
    switch (attendance.response) {
      case AttendanceStatus.Absence:
        return <Badge color={BadgeColor.red} content="불참" />
      case AttendanceStatus.Tardy:
        return <Badge color={BadgeColor.yellow} content="부분참석" />
      case AttendanceStatus.Present:
      default:
        return <Badge color={BadgeColor.green} content="참석" />
    }
  }

  return (
    <Card>
      <CardContent className="flex aspect-square flex-col items-center justify-center space-y-5 p-6">
        <span className="text-lg font-semibold">
          {attendance.Roster.name} /{' '}
          {attendance.Roster.admissionYear.toString().slice(2)}학번
        </span>
        <div className="flex items-center space-x-2">
          <p className="text-sm">응답</p>
          {renderAttendanceStatus(attendance)}
        </div>
        <div className="flex w-full flex-col items-center space-y-2">
          <Button
            disabled={isFethcing}
            onClick={() => handleClick(AttendanceStatus.Present)}
            className="w-full"
            variant="outline"
          >
            참석
          </Button>
          <Button
            disabled={isFethcing}
            onClick={() => handleClick(AttendanceStatus.Tardy)}
            className="w-full"
            variant="outline"
          >
            부분참석
          </Button>
          <Button
            disabled={isFethcing}
            onClick={() => handleClick(AttendanceStatus.Absence)}
            className="w-full"
            variant="outline"
          >
            불참
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
