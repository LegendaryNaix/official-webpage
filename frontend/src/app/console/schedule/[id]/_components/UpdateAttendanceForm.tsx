'use client'

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
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { AttendanceLocation, AttendanceStatus } from '@/lib/enums'
import fetcher from '@/lib/fetcher'
import { AttendanceFormSchema } from '@/lib/forms'
import type { AttendanceListItem } from '@/lib/types/attendance'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, type Dispatch, type SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function UpdateAttendanceForm({
  attendance,
  open,
  setOpen
}: {
  attendance: AttendanceListItem
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const router = useRouter()

  const [isFetching, setIsFetching] = useState(false)

  const UpdateAttendanceFormSchema = AttendanceFormSchema.pick({
    location: true,
    response: true,
    reason: true
  })

  const form = useForm<z.infer<typeof UpdateAttendanceFormSchema>>({
    resolver: zodResolver(UpdateAttendanceFormSchema),
    defaultValues: {
      ...attendance,
      reason: attendance.reason ? attendance.reason : ''
    }
  })

  const onSubmit = async (data: z.infer<typeof UpdateAttendanceFormSchema>) => {
    setIsFetching(true)

    if (data.response !== AttendanceStatus.Present && !data.reason) {
      toast.warning('불참 또는 부분참석 사유를 입력하지 않았습니다')
      setIsFetching(false)
      return
    }

    try {
      if (data.response === AttendanceStatus.Absence)
        data.location = AttendanceLocation.Other

      await fetcher.put(`/attendances/${attendance.id}`, data, false)
      setOpen(false)
      toast.success('출결정보가 업데이트 되었습니다')
      router.refresh()
    } catch (error) {
      toast.error('출결정보를 업데이트하지 못했습니다')
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    form.reset({
      ...attendance,
      reason: attendance.reason ? attendance.reason : ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DrawerHeader>
                <DrawerTitle>출결정보 수정</DrawerTitle>
                <DrawerDescription>
                  {attendance.Roster.name}/{attendance.Roster.admissionYear}
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 p-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>위치</FormLabel>
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
                          <SelectItem value={AttendanceLocation.Seoul}>
                            명륜
                          </SelectItem>
                          <SelectItem value={AttendanceLocation.Suwon}>
                            율전
                          </SelectItem>
                          <SelectItem value={AttendanceLocation.Other}>
                            통합
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>응답</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사유</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DrawerFooter>
                <Button type="submit" className="w-full" disabled={isFetching}>
                  수정하기
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
