'use client'

import { Button } from '@/components/ui/button'
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
import { SignUpFormSchema } from '@/lib/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function CreateTempUserPage() {
  const [isFetching, setIsFetching] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      nickname: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof SignUpFormSchema>) => {
    try {
      setIsFetching(true)

      await fetcher.post(`/user/temp`, data, false)
      router.push('/console/account')
      router.refresh()
    } catch (error) {
      toast.error('생성 실패')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center">
      <div className="mt-4 w-full px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">임시계정생성</h1>
      </div>
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>별명</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-2 pt-5">
              <Button
                variant="accent"
                type="submit"
                className="w-full"
                disabled={isFetching}
              >
                계정생성
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={() => router.push('/console/account')}
              >
                목록으로
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}
