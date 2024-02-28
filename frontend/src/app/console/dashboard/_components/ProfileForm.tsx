'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
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
import { AccountFormSchema } from '@/lib/forms'
import type { UserProfile } from '@/lib/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const ProfileFormSchema = AccountFormSchema.omit({ password: true })
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      ...profile
    }
  })

  const onSubmit = async (data: z.infer<typeof ProfileFormSchema>) => {
    try {
      await fetcher.put('/user', data, false)
      setOpen(false)
      toast.success('프로필 정보가 업데이트 되었습니다')
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error('프로필 정보 업데이트 실패')
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="text-sm font-medium text-zinc-400">
          프로필 수정
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DrawerHeader>
                <DrawerTitle>프로필 정보 수정</DrawerTitle>
                <DrawerDescription>
                  수정할 정보를 입력한 후 수정하기 버튼을 눌러주세요
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 p-4">
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>닉네임</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DrawerFooter>
                <Button type="submit" className="w-full">
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
