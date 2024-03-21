'use client'

import Badge, { BadgeColor } from '@/components/Badge'
import { DataTable } from '@/components/DataTable'
import LocalTime from '@/components/Localtime'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { SurveyGroupListItem } from '@/lib/types/survey'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import DeleteSurveyGroupForm from './DeleteSurveyGroupForm'
import UpdateSurveyGroupForm from './UpdateSurveyGroupForm'

export default function SurveyGroupListTable({
  surveyGroups
}: {
  surveyGroups: SurveyGroupListItem[]
}) {
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [targetSurveyGroup, setTargetSurveyGroup] =
    useState<SurveyGroupListItem>()

  const handleUpdateClick = (surveyGroup: SurveyGroupListItem) => {
    setTargetSurveyGroup(surveyGroup)
    setUpdateOpen(true)
  }

  const handleDeleteClick = (surveyGroup: SurveyGroupListItem) => {
    setTargetSurveyGroup(surveyGroup)
    setDeleteOpen(true)
  }

  const renderRequired = (surveyGroup: SurveyGroupListItem) => {
    switch (surveyGroup.required) {
      case true:
        return <Badge color={BadgeColor.green} content="필수" />
      case false:
      default:
        return <Badge color={BadgeColor.red} content="선택" />
    }
  }

  const renderStatus = (surveyGroup: SurveyGroupListItem) => {
    const now = new Date()

    if (now > new Date(surveyGroup.endedAt)) {
      return <Badge color={BadgeColor.gray} content="마감" />
    }

    if (
      now >= new Date(surveyGroup.startedAt) &&
      now <= new Date(surveyGroup.endedAt)
    ) {
      return <Badge color={BadgeColor.green} content="진행중" />
    }

    return <Badge color={BadgeColor.yellow} content="시작전" />
  }

  const columns: ColumnDef<SurveyGroupListItem>[] = [
    {
      accessorKey: 'name',
      header: '출석조사 그룹명'
    },
    {
      id: 'status',
      header: '상태',
      cell: ({ row }) => {
        const surveyGroup: SurveyGroupListItem = row.original
        return renderStatus(surveyGroup)
      }
    },
    {
      accessorKey: 'startedAt',
      header: '출석조사 시작',
      cell: ({ row }) => {
        return (
          <LocalTime
            format="YYYY-MM-DD ddd HH:mm"
            utc={row.getValue('startedAt')}
          />
        )
      }
    },
    {
      accessorKey: 'endedAt',
      header: '출석조사 마감',
      cell: ({ row }) => {
        return (
          <LocalTime
            format="YYYY-MM-DD ddd HH:mm"
            utc={row.getValue('endedAt')}
          />
        )
      }
    },
    {
      accessorKey: 'required',
      header: '응답 필수여부',
      cell: ({ row }) => {
        const surveyGroup: SurveyGroupListItem = row.original
        return renderRequired(surveyGroup)
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const surveyGroup = row.original

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
              <DropdownMenuItem
                onClick={async () => {
                  const link = `https://skku-royals.com/survey/${surveyGroup.id}`
                  await navigator.clipboard.writeText(link)
                  toast.info('클립보드에 링크가 복사되었습니다')
                }}
              >
                링크 복사
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/console/survey/${surveyGroup.id}/unsubmit`}>
                  미응답자 확인
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleUpdateClick(surveyGroup)}>
                수정
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteClick(surveyGroup)}>
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  return (
    <>
      <DataTable columns={columns} data={surveyGroups} />
      {targetSurveyGroup && (
        <UpdateSurveyGroupForm
          surveyGroup={targetSurveyGroup}
          open={updateOpen}
          setOpen={setUpdateOpen}
        />
      )}
      {targetSurveyGroup && (
        <DeleteSurveyGroupForm
          surveyGroup={targetSurveyGroup}
          open={deleteOpen}
          setOpen={setDeleteOpen}
        />
      )}
    </>
  )
}
