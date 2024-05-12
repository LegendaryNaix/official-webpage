'use client'

import LocalTime from '@/components/Localtime'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import { AttendanceLocation, AttendanceStatus, ScheduleType } from '@/lib/enums'
import { FetchError } from '@/lib/error'
import fetcher from '@/lib/fetcher'
import { AttendanceFormSchema } from '@/lib/forms'
import type { Schedule } from '@/lib/types/schedule'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function SubmitSurveyForm({
  schedules,
  studentId,
  surveyGroupId
}: {
  schedules: Schedule[]
  studentId: string
  surveyGroupId: number
}) {
  const router = useRouter()
  const [isFetching, setIsFetching] = useState(false)

  const CreateAttendanceFormSchema = z.object({
    attendances: z.array(
      AttendanceFormSchema.omit({ result: true, studentId: true })
    )
  })

  const form = useForm<z.infer<typeof CreateAttendanceFormSchema>>({
    resolver: zodResolver(CreateAttendanceFormSchema),
    defaultValues: {
      attendances: schedules.map((schedule) => {
        return {
          scheduleId: schedule.id,
          response: AttendanceStatus.Present,
          location:
            schedule.type === ScheduleType.SeperatedExercise
              ? AttendanceLocation.Seoul
              : AttendanceLocation.Other,
          reason: ''
        }
      })
    }
  })

  const onSubmit = async (data: z.infer<typeof CreateAttendanceFormSchema>) => {
    setIsFetching(true)

    let validReason = true

    data.attendances.forEach((attendance, index) => {
      if (
        attendance.response !== AttendanceStatus.Present &&
        !attendance.reason
      ) {
        toast.warning(
          `[#${index + 1} ${schedules[index].name}]의 불참 또는 부분참석 사유를 입력하지 않았습니다`
        )
        validReason = false
      }
      if (
        attendance.reason !== AttendanceStatus.Present &&
        attendance.reason?.trim().length === 0
      ) {
        toast.warning(
          `[#${index + 1} ${schedules[index].name}]의 불참 또는 부분참석 사유가 충분하지 않습니다`
        )
        validReason = false
      }
    })

    if (!validReason) {
      setIsFetching(false)
      return
    }

    try {
      data.attendances.forEach((attendance) => {
        if (attendance.response === AttendanceStatus.Absence) {
          attendance.location = AttendanceLocation.Other
        }
      })

      await fetcher.post(
        `/surveys/groups/${surveyGroupId}/submit`,
        {
          studentId,
          attendances: data.attendances
        },
        false
      )

      toast.success('출석조사 제출 완료')
      router.push('/survey')
    } catch (error) {
      if (error instanceof FetchError) {
        toast.error(error.message)
      } else {
        toast.error('출석조사를 제출하지 못했습니다')
      }
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-10">
        <div className="pb-3 text-lg font-bold sm:text-xl">출석조사 항목</div>
        <div className="flex w-full flex-col space-y-5">
          {form.getValues('attendances').map((attendance, index) => {
            return (
              <Card key={index} className="py-5">
                <CardTitle className="px-6">
                  #{index + 1} {schedules[index].name}
                </CardTitle>
                <CardDescription className="px-6">
                  {
                    <LocalTime
                      utc={schedules[index].startedAt}
                      format="MM/DD ddd HH:mm"
                    />
                  }{' '}
                  ~{' '}
                  {<LocalTime utc={schedules[index].endedAt} format="HH:mm" />}
                  <p>{schedules[index].description}</p>
                </CardDescription>
                <CardContent className="mt-2 flex flex-col space-y-3">
                  <FormField
                    control={form.control}
                    name={`attendances.${index}.response`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>출석여부</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="출석여부를 선택해주세요" />
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
                      </FormItem>
                    )}
                  />
                  {schedules[index].type === ScheduleType.SeperatedExercise && (
                    <FormField
                      control={form.control}
                      name={`attendances.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>출석캠퍼스</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="출석할 캠퍼스를 선택해주세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={AttendanceLocation.Seoul}>
                                명륜
                              </SelectItem>
                              <SelectItem value={AttendanceLocation.Suwon}>
                                율전
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name={`attendances.${index}.reason`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>불참 또는 부분참석 사유</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="이곳에 사유를 입력해주세요"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )
          })}
          <div className="flex items-center justify-between space-x-1">
            <Button
              type="submit"
              variant="accent"
              className="w-full"
              disabled={isFetching}
            >
              제출하기
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/survey')}
              className="w-full"
            >
              목록으로
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
