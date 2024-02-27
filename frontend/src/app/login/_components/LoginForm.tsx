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
import { LoginFormSchema } from '@/lib/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function LoginForm() {
  const [isFetching, setIsFetching] = useState(false)

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    try {
      setIsFetching(true)
      const res = await signIn('credentials', {
        data,
        redirect: false
      })

      if (!res?.error) {
        toast.success('로그인 되었습니다')
      } else {
        console.log(res.error)
        toast.error('로그인 실패')
      }
    } catch (error) {
      toast.error('로그인 실패')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Username</FormLabel>
              <FormControl>
                <Input placeholder="아이디" {...field} />
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
              <FormLabel className="sr-only">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="패스워드" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="accent"
          type="submit"
          className="w-full"
          disabled={isFetching}
        >
          로그인
        </Button>
      </form>
    </Form>
  )
}
