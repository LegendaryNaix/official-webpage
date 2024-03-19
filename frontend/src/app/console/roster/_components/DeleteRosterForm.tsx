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
import fetcher from '@/lib/fetcher'
import { RosterFormSchema } from '@/lib/forms'
import type { RosterListItem } from '@/lib/types/roster'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, type Dispatch, type SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function DeleteRosterForm({
  roster,
  open,
  setOpen
}: {
  roster: RosterListItem
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const router = useRouter()

  const [isFetching, setIsFetching] = useState(false)

  const DeleteRosterFormSchema = RosterFormSchema.pick({
    name: true,
    studentId: true
  })

  const form = useForm<z.infer<typeof DeleteRosterFormSchema>>({
    resolver: zodResolver(DeleteRosterFormSchema),
    defaultValues: {
      name: '',
      studentId: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof DeleteRosterFormSchema>) => {
    setIsFetching(true)

    if (data.name !== roster.name || data.studentId !== roster.studentId) {
      toast.warning('이름 또는 학번을 확인해주세요')
      return
    }

    try {
      await fetcher.delete<RosterListItem>(`/rosters/${roster.id}`, {}, false)

      setOpen(false)
      toast.success(`부원 ${roster.name}을 삭제했습니다`)
      router.refresh()
    } catch (error) {
      toast.error('부원을 삭제하지 못했습니다')
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    form.reset({
      name: ''
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
                <DrawerTitle>로스터 삭제</DrawerTitle>
                <DrawerDescription>
                  삭제할 로스터의 이름과 학번을 정확하게 입력해주세요
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={roster.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>학번</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={roster.studentId} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DrawerFooter>
                <Button type="submit" className="w-full" disabled={isFetching}>
                  삭제하기
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
