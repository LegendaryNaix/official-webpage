'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RosterFormSchema } from '@/lib/forms'
import type { RosterListItem } from '@/lib/types/roster'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

export function DeleteRosterForm({ roster }: { roster: RosterListItem }) {
  const DeleteRosterFormSchema = RosterFormSchema.pick({
    id: true,
    name: true,
    studentId: true
  })

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof DeleteRosterFormSchema>>({
    resolver: zodResolver(DeleteRosterFormSchema),
    defaultValues: {
      id: roster.id
    }
  })

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button>삭제</button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <Form {...form}>
            <form>
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
                        <Input {...field} placeholder={roster.backNumber} />
                      </FormControl>
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
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
