'use client'

import Badge, { BadgeColor } from '@/components/Badge'
import { DataTable } from '@/components/DataTable'
import LocalTime from '@/components/Localtime'
import { Button } from '@/components/ui/button'
import { ScheduleType } from '@/lib/enums'
import type { ScheduleListItem } from '@/lib/types/schedule'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export default function ScheduleListTable({
  schedules
}: {
  schedules: ScheduleListItem[]
}) {
  const renderScheduleType = (schedule: ScheduleListItem) => {
    switch (schedule.type) {
      case ScheduleType.IntegratedExercise:
        return <Badge color={BadgeColor.indigo} content="통합훈련" />
      case ScheduleType.SeperatedExercise:
        return <Badge color={BadgeColor.pink} content="캠퍼스별훈련" />
      case ScheduleType.Game:
        return <Badge color={BadgeColor.green} content="시합" />
      case ScheduleType.Event:
      default:
        return <Badge color={BadgeColor.gray} content="행사" />
    }
  }

  const columns: ColumnDef<ScheduleListItem>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: '일정명'
    },
    {
      accessorKey: 'startedAt',
      header: '시작',
      cell: ({ row }) => {
        return (
          <LocalTime
            utc={row.getValue('startedAt')}
            format="YYYY-MM-DD ddd HH:mm"
          />
        )
      }
    },
    {
      accessorKey: 'endedAt',
      header: '종료',
      cell: ({ row }) => {
        return (
          <LocalTime
            utc={row.getValue('endedAt')}
            format="YYYY-MM-DD ddd HH:mm"
          />
        )
      }
    },
    {
      accessorKey: 'type',
      header: '구분',
      cell: ({ row }) => {
        const schedule = row.original
        return renderScheduleType(schedule)
      }
    },
    {
      id: 'action',
      header: '상세보기',
      cell: ({ row }) => {
        return (
          <Link href={`/console/schedule/${row.getValue('id')}`}>
            <Button variant="ghost">
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        )
      }
    }
  ]

  return <DataTable columns={columns} data={schedules} />
}
