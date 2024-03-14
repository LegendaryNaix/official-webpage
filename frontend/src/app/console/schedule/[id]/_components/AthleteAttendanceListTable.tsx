'use client'

import Badge, { BadgeColor } from '@/components/Badge'
import { DataTable } from '@/components/DataTable'
import { AttendanceLocation, AttendanceStatus, RosterType } from '@/lib/enums'
import type { AttendanceListItem } from '@/lib/types/attendance'
import type { RosterListItem } from '@/lib/types/roster'
import type { ColumnDef } from '@tanstack/react-table'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'

export default function AthleteAttendanceListTable({
  attendances
}: {
  attendances: AttendanceListItem[]
}) {
  const renderAthletePosition = (roster: RosterListItem) => {
    const positions = []
    switch (roster.type) {
      case RosterType.Athlete:
        roster.offPosition ? positions.push(roster.offPosition) : null
        roster.defPosition ? positions.push(roster.defPosition) : null
        roster.splPosition ? positions.push(roster.splPosition) : null
        return <p className="text-nowrap">{positions.join('/')}</p>
      default:
        return <p className="text-nowrap">-</p>
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
    if (attendance.response === AttendanceStatus.Absence) return

    switch (attendance.location) {
      case AttendanceLocation.Seoul:
        return <Badge color={BadgeColor.purple} content="명륜" />
      case AttendanceLocation.Suwon:
        return <Badge color={BadgeColor.indigo} content="율전" />
      default:
        return <Badge color={BadgeColor.gray} content="통합" />
    }
  }

  const renderAthleteType = (roster: RosterListItem) => {
    if (roster.registerYear === new Date().getFullYear()) {
      return <Badge color={BadgeColor.yellow} content="신입생" />
    }
    return <Badge color={BadgeColor.blue} content="재학생" />
  }

  const columns: ColumnDef<AttendanceListItem>[] = [
    {
      id: 'rosterProfile',
      header: '이름',
      cell: ({ row }) => {
        const attendance = row.original

        return (
          <div className="flex flex-nowrap gap-x-1">
            {attendance.Roster.profileImageUrl ? (
              <Image
                src={attendance.Roster.profileImageUrl}
                width={128}
                height={128}
                alt="profile"
                className="h-6 w-6 object-cover"
              />
            ) : (
              <UserIcon className="h-6 w-6 object-cover" />
            )}
            <p className="text-nowrap text-base">{attendance.Roster.name}</p>
          </div>
        )
      }
    },
    {
      id: 'admissionYear',
      header: '학번',
      cell: ({ row }) => {
        const attendance = row.original
        return attendance.Roster.admissionYear
      }
    },
    {
      id: 'position',
      header: '포지션',
      cell: ({ row }) => {
        const attendance = row.original

        return renderAthletePosition(attendance.Roster)
      }
    },
    {
      accessorKey: 'location',
      header: '위치',
      cell: ({ row }) => {
        const attendance = row.original

        return renderAttendanceLocation(attendance)
      }
    },
    {
      id: 'type',
      header: '구분',
      cell: ({ row }) => {
        const attendance = row.original

        return renderAthleteType(attendance.Roster)
      }
    },
    {
      accessorKey: 'response',
      header: '응답',
      cell: ({ row }) => {
        const attendance = row.original

        return renderAttendanceStatus(attendance)
      }
    },
    {
      accessorKey: 'reason',
      header: '사유'
    }
  ]

  return <DataTable columns={columns} data={attendances} />
}
