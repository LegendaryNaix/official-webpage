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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AccountStatus, Role } from '@/lib/enums'
import { FetchError } from '@/lib/error'
import fetcher from '@/lib/fetcher'
import { AccountFormSchema } from '@/lib/forms'
import type { UserListItem } from '@/lib/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, type Dispatch, type SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function UpdateUserForm({
  user,
  open,
  setOpen
}: {
  user: UserListItem
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const router = useRouter()

  const [isFetching, setIsFetching] = useState(false)

  const UpdateAccountFormSchema = AccountFormSchema.pick({
    role: true,
    status: true
  })

  const form = useForm<z.infer<typeof UpdateAccountFormSchema>>({
    resolver: zodResolver(UpdateAccountFormSchema),
    defaultValues: {
      role: user.role,
      status: user.status
    }
  })

  const onSubmit = async (data: z.infer<typeof UpdateAccountFormSchema>) => {
    try {
      setIsFetching(true)
      await fetcher.put(`/user/${user.id}`, data, false)

      setOpen(false)
      toast.success('계정이 업데이트 되었습니다')
      router.refresh()
    } catch (error) {
      if (error instanceof FetchError) {
        toast.error(error.message)
      } else {
        toast.error('계정을 업데이트하지 못했습니다')
      }
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    form.reset({
      role: user.role,
      status: user.status
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
                <DrawerTitle>계정 정보 변경</DrawerTitle>
                <DrawerDescription>
                  계정의 권한 및 상태를 변경합니다
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 p-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>권한</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="권한을 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Role.User}>일반</SelectItem>
                          <SelectItem value={Role.Manager}>매니저</SelectItem>
                          <SelectItem value={Role.Admin}>관리자</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상태</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="계정 상태를 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={AccountStatus.Disable}>
                            이메일 미인증
                          </SelectItem>
                          <SelectItem value={AccountStatus.Verifying}>
                            계정승인 대기
                          </SelectItem>
                          <SelectItem value={AccountStatus.Enable}>
                            활성화
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
