'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useDate } from '@/hooks/useDate'
import { auth } from '@/lib/auth'
import { FetchError } from '@/lib/error'
import { cn } from '@/lib/utils'
import { API_BASE_URL } from '@/lib/vars'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function AttendanceRangeForm() {
  const [isFetching, setIsFetching] = useState(false)
  const router = useRouter()

  const { formatDate, parseUTCDate } = useDate()

  const AttendanceRangeFormSchema = z.object({
    start: z.date(),
    end: z.date()
  })

  const form = useForm<z.infer<typeof AttendanceRangeFormSchema>>({
    resolver: zodResolver(AttendanceRangeFormSchema),
    defaultValues: {
      start: new Date(),
      end: new Date()
    }
  })

  const onSubmit = async (data: z.infer<typeof AttendanceRangeFormSchema>) => {
    try {
      setIsFetching(true)

      const session = await auth()

      const response = await fetch(
        API_BASE_URL +
          `/attendances/excel-file/range?start=${data.start}&end=${data.end}`,
        {
          headers: {
            Authorization: session?.token.accessToken ?? ''
          }
        }
      )

      if (!response.ok) {
        const data = await response.json()

        throw new FetchError(data.message)
      }

      const blob = await response.blob()

      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', '출석 통계.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()

      router.refresh()
    } catch (error) {
      if (error instanceof FetchError) {
        toast.error(error.message)
      } else {
        toast.error('출석정보를 불러오지 못했습니다')
      }
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>집계 시작날짜</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          formatDate(
                            parseUTCDate(field.value.toISOString()),
                            'YYYY-MM-DD'
                          )
                        ) : (
                          <span>날짜를 선택해주세요</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>집계 종료날짜</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          formatDate(
                            parseUTCDate(field.value.toISOString()),
                            'YYYY-MM-DD'
                          )
                        ) : (
                          <span>날짜를 선택해주세요</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-3 pt-5">
            <Button
              type="submit"
              variant="accent"
              className="w-full"
              disabled={isFetching}
            >
              엑셀파일로 다운로드
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              뒤로가기
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
