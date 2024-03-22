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
import { VerifyEmailFormSchema } from '@/lib/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function VerifyEmailForm({ email }: { email: string }) {
  const [isFetching, setIsFetching] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof VerifyEmailFormSchema>>({
    resolver: zodResolver(VerifyEmailFormSchema),
    defaultValues: {
      pin: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof VerifyEmailFormSchema>) => {
    try {
      setIsFetching(true)
      const result = await fetcher.post<{ valid: boolean }>(
        `/user/verify-email?email=${email}&pin=${data.pin}`,
        {},
        false
      )

      if (!result.valid) throw new Error()

      router.push('/login')
      toast.success('회원가입이 완료되었습니다')
    } catch (error) {
      toast.error('인증코드가 일치하지 않습니다')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">pin</FormLabel>
              <FormControl>
                <Input placeholder="인증코드" {...field} />
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
          이메일 주소 인증
        </Button>
      </form>
    </Form>
  )
}
