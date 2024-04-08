'use client'

import Badge, { BadgeColor } from '@/components/Badge'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AttendanceLocation, AttendanceStatus } from '@/lib/enums'
import type { AttendanceListItem } from '@/lib/types/attendance'
import type { RosterListItem } from '@/lib/types/roster'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import AttendanceCheckForm from './AttendanceCheckForm'

export default function AttendanceCheckListTable({
  attendances
}: {
  attendances: AttendanceListItem[]
}) {
  const [open, setOpen] = useState(false)
  const [targetAttendance, setTargetAttendance] = useState<AttendanceListItem>()

  const handleClick = (attendance: AttendanceListItem) => {
    setTargetAttendance(attendance)
    setOpen(true)
  }

  const renderAttendanceStatus = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.Absence:
        return <Badge color={BadgeColor.red} content="불참" />
      case AttendanceStatus.Tardy:
        return <Badge color={BadgeColor.yellow} content="부분참석" />
      case AttendanceStatus.Present:
        return <Badge color={BadgeColor.green} content="참석" />
      default:
        return <Badge color={BadgeColor.gray} content="체크전" />
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

        return <p className="text-nowrap text-base">{attendance.Roster.name}</p>
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

        return renderAttendanceStatus(attendance.response)
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const attendance = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>메뉴</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleClick(attendance)}>
                체크
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  return (
    <>
      <DataTable columns={columns} data={attendances} />
      {targetAttendance && (
        <AttendanceCheckForm
          attendance={targetAttendance}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  )
}
