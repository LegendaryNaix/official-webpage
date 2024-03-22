'use client'

import { DataTable } from '@/components/DataTable'
import LocalTime from '@/components/Localtime'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { UserListItem } from '@/lib/types/user'
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import UpdateUserForm from './UpdateUserForm'

export default function UserListTable({ users }: { users: UserListItem[] }) {
  const [updateModalOpen, setUpdateModalOpen] = useState(false)

  const [targetUser, setTargetUser] = useState<UserListItem>()

  const handleUpdateClick = (user: UserListItem) => {
    setTargetUser(user)
    setUpdateModalOpen(true)
  }

  const columns: ColumnDef<UserListItem>[] = [
    {
      accessorKey: 'username',
      header: '아이디'
    },
    {
      accessorKey: 'email',
      header: '이메일'
    },
    {
      accessorKey: 'nickname',
      header: '닉네임'
    },
    {
      accessorKey: 'role',
      header: '권한'
    },
    {
      accessorKey: 'status',
      header: '계정상태'
    },
    {
      accessorKey: 'lastLogin',
      header: '마지막 로그인',
      cell: ({ row }) => {
        return (
          <LocalTime
            utc={row.getValue('lastLogin')}
            format="YYYY-MM-DD ddd HH:mm:ss"
          />
        )
      }
    },
    {
      id: 'action',
      cell: ({ row }) => {
        const user = row.original

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
              <DropdownMenuItem onClick={() => handleUpdateClick(user)}>
                수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  return (
    <>
      <DataTable columns={columns} data={users} />
      {targetUser && (
        <UpdateUserForm
          user={targetUser}
          open={updateModalOpen}
          setOpen={setUpdateModalOpen}
        />
      )}
    </>
  )
}
