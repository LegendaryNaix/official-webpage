'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDate } from '@/hooks/useDate'
import { ScheduleType } from '@/lib/enums'
import fetcher from '@/lib/fetcher'
import { ScheduleSchema, SurveyGroupSchema } from '@/lib/forms'
import type { SurveyGroupListItem } from '@/lib/types/survey'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const scheduleDefault = {
  name: '',
  description: '',
  type: ScheduleType.IntegratedExercise,
  surveyGroupId: 0,
  startedAtDate: new Date(),
  startedAtTime: '',
  endedAtDate: new Date(),
  endedAtTime: ''
}

export default function CreateSurveyForm() {
  const router = useRouter()

  const { formatDate, parseUTCDate, createLocalDate, toUTCString } = useDate()
  const [isFetching, setIsFetching] = useState(false)

  const CreateSurveySchema = z.object({
    surveyGroup: SurveyGroupSchema.omit({ id: true }),
    schedules: z.array(ScheduleSchema.omit({ id: true }))
  })

  const form = useForm<z.infer<typeof CreateSurveySchema>>({
    resolver: zodResolver(CreateSurveySchema),
    defaultValues: {
      surveyGroup: {
        name: '',
        startedAtDate: new Date(),
        startedAtTime: '',
        endedAtDate: new Date(),
        endedAtTime: '',
        required: true
      },
      schedules: Array.from({ length: 3 }, () => ({ ...scheduleDefault }))
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedules'
  })

  const onSubmit = async (data: z.infer<typeof CreateSurveySchema>) => {
    setIsFetching(true)

    const surveyGroupData = {
      name: data.surveyGroup.name,
      required: data.surveyGroup.required,
      startedAt: toUTCString(
        createLocalDate(
          `${data.surveyGroup.startedAtDate.getFullYear()}-${data.surveyGroup.startedAtDate.getMonth() + 1}-${data.surveyGroup.startedAtDate.getDate()}` +
            ' ' +
            data.surveyGroup.startedAtTime,
          'YYYY-MM-DD HH:mm'
        )
      ),
      endedAt: toUTCString(
        createLocalDate(
          `${data.surveyGroup.endedAtDate.getFullYear()}-${data.surveyGroup.endedAtDate.getMonth() + 1}-${data.surveyGroup.endedAtDate.getDate()}` +
            ' ' +
            data.surveyGroup.endedAtTime,
          'YYYY-MM-DD HH:mm'
        )
      )
    }

    if (surveyGroupData.startedAt >= surveyGroupData.endedAt) {
      toast.warning('출석조사 시작시간은 종료시간보다 빨라야합니다')
      return
    }

    const scheduleData = data.schedules.map((schedule) => {
      return {
        name: schedule.name,
        type: schedule.type,
        description: schedule.description,
        startedAt: toUTCString(
          createLocalDate(
            `${schedule.startedAtDate.getFullYear()}-${schedule.startedAtDate.getMonth() + 1}-${schedule.startedAtDate.getDate()}` +
              ' ' +
              schedule.startedAtTime,
            'YYYY-MM-DD HH:mm'
          )
        ),
        endedAt: toUTCString(
          createLocalDate(
            `${schedule.endedAtDate.getFullYear()}-${schedule.endedAtDate.getMonth() + 1}-${schedule.endedAtDate.getDate()}` +
              ' ' +
              schedule.endedAtTime,
            'YYYY-MM-DD HH:mm'
          )
        )
      }
    })

    scheduleData.forEach((schedule, index) => {
      if (schedule.startedAt >= schedule.endedAt) {
        toast.warning(
          `일정 시작시간은 종료시간보다 빨라야합니다 [일정 #${index + 1}]`
        )
        return
      }
    })

    try {
      const generatedSurveyGroup = await fetcher.post<SurveyGroupListItem>(
        '/surveys/groups',
        surveyGroupData,
        false
      )

      await Promise.all(
        scheduleData.map((scheduleData) => {
          fetcher.post(
            '/surveys/schedules',
            {
              ...scheduleData,
              surveyGroupId: generatedSurveyGroup.id
            },
            false
          )
        })
      ).catch(() => {
        throw new Error('fetch failed')
      })
      toast.success('출석조사가 생성되었습니다')
      router.push('/console/survey?revalidate=true')
    } catch (error) {
      toast.error('출석조사를 생성하지 못했습니다')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-5"
      >
        <div className="col-span-12">
          <h2 className="text-lg font-semibold">출석조사 정보</h2>
        </div>
        <div className="col-span-12 space-y-3">
          <FormField
            control={form.control}
            name="surveyGroup.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-12 grid grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="surveyGroup.startedAtDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>조사 시작날짜</FormLabel>
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
              name="surveyGroup.startedAtTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>조사 시작시간</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="surveyGroup.endedAtDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>조사 종료날짜</FormLabel>
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
              name="surveyGroup.endedAtTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>조사 종료시간</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="col-span-12">
          <FormField
            control={form.control}
            name="surveyGroup.required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-none">
                <FormControl className="mt-0.5">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>필수 여부</FormLabel>
                  <FormDescription>
                    체크할 경우 모든 부원이 출석조사에 응답해야 합니다
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 flex flex-col space-y-3">
          <hr className="w-full border-t border-zinc-200 dark:border-zinc-400" />
          {form.getValues('schedules').map((schdule, index) => {
            return (
              <div key={index}>
                <h2 className="pb-5 text-lg font-semibold">
                  일정 #{index + 1}
                </h2>
                <div className="gird-cols-12 grid space-y-3">
                  <div className="col-span-12 grid grid-cols-2 gap-x-2">
                    <FormField
                      control={form.control}
                      name={`schedules.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>일정명</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schedules.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>일정 종류</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="일정 종류를 선택해주세요ㅕ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                value={ScheduleType.IntegratedExercise}
                              >
                                통합 훈련
                              </SelectItem>
                              <SelectItem
                                value={ScheduleType.SeperatedExercise}
                              >
                                캠퍼스별 훈련
                              </SelectItem>
                              <SelectItem value={ScheduleType.Game}>
                                시합
                              </SelectItem>
                              <SelectItem value={ScheduleType.Event}>
                                행사
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-12 grid grid-cols-2 gap-x-2">
                    <FormField
                      control={form.control}
                      name={`schedules.${index}.startedAtDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>일정 시작날짜</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                      name={`schedules.${index}.startedAtTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>일정 시작시간</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-12 grid grid-cols-2 gap-x-2">
                    <FormField
                      control={form.control}
                      name={`schedules.${index}.endedAtDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>일정 종료날짜</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                      name={`schedules.${index}.endedAtTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>일정 종료시간</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-12">
                    <FormField
                      control={form.control}
                      name={`schedules.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>일정 설명</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="이곳에 일정에 대한 설명을 입력해주세요"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <hr className="mt-5 w-full border-t border-zinc-200 dark:border-zinc-400" />
              </div>
            )
          })}
        </div>
        <div className="col-span-12 flex items-center space-x-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => append(scheduleDefault)}
            className="px-8"
          >
            +
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => fields.length > 1 && remove(fields.length - 1)}
            className="px-8"
            disabled={fields.length <= 1}
          >
            -
          </Button>
        </div>
        <div className="col-span-12 flex items-center space-x-1">
          <Button type="submit" variant="accent" disabled={isFetching}>
            생성하기
          </Button>
          <Button type="button" onClick={() => router.back()}>
            목록으로
          </Button>
        </div>
      </form>
    </Form>
  )
}
