'use client'

import { DataTable } from '@/components/DataTable'
import type {
  AttendanceStatistic,
  AttendanceStatisticItem
} from '@/lib/types/attendance'
import type { ColumnDef } from '@tanstack/react-table'

interface Row extends AttendanceStatisticItem {
  title: string
}

export default function AttendanceStatisticTable(
  statistic: AttendanceStatistic
) {
  const statisticList: Row[] = [
    { ...statistic.athlete, title: '선수 (재학생)' },
    { ...statistic.athleteNewbie, title: '선수 (신입생)' },
    { ...statistic.staff, title: '스태프 (재학생)' },
    { ...statistic.staffNewbie, title: '스태프 (신입생)' }
  ]

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'title',
      header: '구분'
    },
    {
      accessorKey: 'total',
      header: '합계'
    },
    {
      accessorKey: 'seoul',
      header: '명륜'
    },
    {
      accessorKey: 'suwon',
      header: '율전'
    },
    {
      accessorKey: 'absence',
      header: '불참'
    }
  ]

  return <DataTable columns={columns} data={statisticList} />
}
