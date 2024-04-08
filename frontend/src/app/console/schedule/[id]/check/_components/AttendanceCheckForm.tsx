'use client'

import Badge, { BadgeColor } from '@/components/Badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AttendanceLocation, AttendanceStatus } from '@/lib/enums'
import fetcher from '@/lib/fetcher'
import { AttendanceFormSchema } from '@/lib/forms'
import type { AttendanceListItem } from '@/lib/types/attendance'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function AttendanceCheckForm({
  attendance,
  open,
  setOpen
}: {
  attendance: AttendanceListItem
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [isFetching, setIsFetching] = useState(false)
  const router = useRouter()

  const CheckAttendanceFormSchema = AttendanceFormSchema.pick({
    result: true
  })

  const form = useForm<z.infer<typeof CheckAttendanceFormSchema>>({
    resolver: zodResolver(CheckAttendanceFormSchema),
    defaultValues: {
      result: attendance.response
    }
  })

  useEffect(() => {
    form.reset({
      result: attendance.response
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onSubmit = async (data: z.infer<typeof CheckAttendanceFormSchema>) => {
    try {
      setIsFetching(true)
      await fetcher.put(`/attendances/${attendance.id}`, data, false)
      setOpen(false)
      toast.success('출석체크 성공')
      router.refresh()
    } catch (error) {
      toast.error('출결 정보를 업데이트하지 못했습니다')
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
        return <Badge color={BadgeColor.pink} content="명륜" />
      case AttendanceLocation.Suwon:
        return <Badge color={BadgeColor.indigo} content="율전" />
      default:
        return <Badge color={BadgeColor.gray} content="통합" />
    }
  }

  const renderType = (attendance: AttendanceListItem) => {
    switch (attendance.Roster.registerYear) {
      case new Date().getFullYear():
        return <Badge color={BadgeColor.yellow} content="신입생" />
      default:
        return <Badge color={BadgeColor.blue} content="재학생" />
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DrawerHeader>
                <DrawerTitle>출석체크</DrawerTitle>
                <DrawerDescription>
                  <div className="flex flex-col space-y-3">
                    <div>
                      {attendance.Roster.name}/{attendance.Roster.admissionYear}
                    </div>
                    <div>구분 {renderType(attendance)}</div>
                    <div>
                      출석조사 응답 {renderAttendanceStatus(attendance)}
                    </div>
                    <div>출석위치 {renderAttendanceLocation(attendance)}</div>
                  </div>
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 p-4">
                <FormField
                  control={form.control}
                  name="result"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>실제출석</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={AttendanceStatus.Present}>
                            참석
                          </SelectItem>
                          <SelectItem value={AttendanceStatus.Tardy}>
                            부분참석
                          </SelectItem>
                          <SelectItem value={AttendanceStatus.Absence}>
                            불참
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <DrawerFooter>
                <Button type="submit" className="w-full" disabled={isFetching}>
                  체크하기
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">취소</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
