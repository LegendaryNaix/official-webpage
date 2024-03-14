import { DataTable } from '@/components/DataTable'
import type { UnsubmitRosterListItem } from '@/lib/types/roster'
import type { ColumnDef } from '@tanstack/react-table'

export default function SurveyUnsubmitListTable({
  rosters
}: {
  rosters: UnsubmitRosterListItem[]
}) {
  const columns: ColumnDef<UnsubmitRosterListItem>[] = [
    {
      accessorKey: 'name',
      header: '이름'
    },
    {
      accessorKey: 'admissionYear',
      header: '학번'
    }
  ]

  return <DataTable columns={columns} data={rosters} />
}
