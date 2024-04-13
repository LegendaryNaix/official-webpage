'use client'

import { DataTable } from '@/components/DataTable'
import type { QuizScore } from '@/lib/types/quiz'
import type { ColumnDef } from '@tanstack/react-table'

export default function RankingTable({ scores }: { scores: QuizScore[] }) {
  const columns: ColumnDef<QuizScore>[] = [
    {
      header: '순위',
      cell: ({ row }) => {
        return <p>{row.index + 1}</p>
      }
    },
    {
      header: '이름',
      cell: ({ row }) => {
        const score = row.original
        return (
          <p>
            {score.Roster.name}({score.Roster.admissionYear})
          </p>
        )
      }
    },
    {
      accessorKey: 'score',
      header: '점수'
    }
  ]

  return <DataTable columns={columns} data={scores} />
}
