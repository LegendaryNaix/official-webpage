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
import { StudentForm } from '@/lib/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function StudentIdForm() {
  const [isFetching, setIsFetching] = useState(false)
  const StudentIdFormSchema = StudentForm.pick({ studentId: true })
  const router = useRouter()

  const form = useForm<z.infer<typeof StudentIdFormSchema>>({
    resolver: zodResolver(StudentIdFormSchema),
    defaultValues: {
      studentId: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof StudentIdFormSchema>) => {
    try {
      setIsFetching(true)
      await fetcher.get(`/rosters/studentId/${data.studentId}`, false)
      router.push(`?studentId=${data.studentId}`)
    } catch (error) {
      toast.error('학번을 확인해주세요')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>학번</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ex) 2024310001" />
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
          학번확인
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => router.push('/survey')}
        >
          목록으로
        </Button>
      </form>
    </Form>
  )
}
