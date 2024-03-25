'use client'

import Badge, { BadgeColor } from '@/components/Badge'
import { Button } from '@/components/ui/button'
import { AttendanceLocation, AttendanceStatus } from '@/lib/enums'
import fetcher from '@/lib/fetcher'
import type { AttendanceListItem } from '@/lib/types/attendance'
import { UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AttendanceCheckCard({
  attendance
}: {
  attendance: AttendanceListItem
}) {
  const [isFethcing, setIsFetching] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleClick = async (result: AttendanceStatus) => {
    try {
      setIsFetching(true)
      await fetcher.put(`/attendances/${attendance.id}`, { result }, false)
      toast.success('출석체크 성공')
      router.push(pathname)
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

  const renderAttendanceLocation = (attendance: AttendanceListItem) => {
    switch (attendance.location) {
      case AttendanceLocation.Seoul:
        return <Badge color={BadgeColor.red} content="명륜" />
      case AttendanceLocation.Suwon:
        return <Badge color={BadgeColor.red} content="율전" />
      default:
        return <Badge color={BadgeColor.gray} content="통합" />
    }
  }

  return (
    <section className="flex aspect-square flex-col items-center justify-center p-0">
      <div className="relative isolate flex w-full flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-64">
        {attendance.Roster.profileImageUrl ? (
          <Image
            src={attendance.Roster.profileImageUrl}
            width={480}
            height={640}
            alt="image"
            className="absolute inset-0 -z-10 h-3/5 w-full object-cover"
          />
        ) : (
          <UserIcon className="absolute inset-0 -z-10 h-3/5 w-full object-cover text-white" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-gray-900/80" />
        <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/40" />

        <div className="flex flex-col space-y-3 text-white">
          <span className="text-base font-semibold">
            {attendance.Roster.name} /{' '}
            {attendance.Roster.admissionYear.toString().slice(2)}학번
          </span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <p className="text-sm">응답:</p>
              {renderAttendanceStatus(attendance)}
            </div>
            <div className="flex items-center space-x-1.5">
              <p className="text-sm">위치:</p>
              {renderAttendanceLocation(attendance)}
            </div>
          </div>
          <div className="flex w-full flex-col items-center space-y-2">
            <Button
              disabled={isFethcing}
              onClick={() => handleClick(AttendanceStatus.Present)}
              className="w-full"
              variant="secondary"
            >
              참석
            </Button>
            <Button
              disabled={isFethcing}
              onClick={() => handleClick(AttendanceStatus.Tardy)}
              className="w-full text-black dark:text-white"
              variant="accent"
            >
              부분참석
            </Button>
            <Button
              disabled={isFethcing}
              onClick={() => handleClick(AttendanceStatus.Absence)}
              className="w-full text-black dark:text-white"
              variant="destructive"
            >
              불참
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
