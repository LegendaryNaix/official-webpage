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
import { RosterType } from '@/lib/enums'
import type { RosterListItem } from '@/lib/types/roster'
import { UserIcon } from '@heroicons/react/24/outline'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { DeleteRosterForm } from './DeleteRosterForm'

export default function RosterListTable({
  rosters
}: {
  rosters: RosterListItem[]
}) {
  const createTypeBadge = (type: RosterType) => {
    switch (type) {
      case RosterType.Athlete:
        return <Badge color={BadgeColor.indigo} content="선수" />
      case RosterType.Staff:
        return <Badge color={BadgeColor.yellow} content="스태프" />
      case RosterType.Coach:
        return <Badge color={BadgeColor.green} content="코치" />
      case RosterType.HeadCoach:
      default:
        return <Badge color={BadgeColor.red} content="감독" />
    }
  }

  const columns: ColumnDef<RosterListItem>[] = [
    {
      id: 'profile',
      header: '이름',
      cell: ({ row }) => {
        const roster = row.original

        return (
          <div className="flex flex-nowrap items-center gap-x-1.5">
            <div className="h-6 w-6 rounded-full">
              {roster.profileImageUrl ? (
                <Image
                  src={roster.profileImageUrl}
                  width={32}
                  height={32}
                  alt=""
                  className="object-cover"
                />
              ) : (
                <UserIcon />
              )}
            </div>
            <p>{roster.name}</p>
          </div>
        )
      }
    },
    {
      accessorKey: 'type',
      header: '구분',
      cell: ({ row }) => {
        return createTypeBadge(row.getValue('type'))
      }
    },
    {
      accessorKey: 'studentId',
      header: '학번'
    },
    {
      accessorKey: 'admissionYear',
      header: '입학년도'
    },
    {
      accessorKey: 'registerYear',
      header: '입부년도'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const roster = row.original

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
              <DropdownMenuItem onClick={() => alert(roster.id)}>
                수정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DeleteRosterForm roster={roster} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  return <DataTable columns={columns} data={rosters} />
}
