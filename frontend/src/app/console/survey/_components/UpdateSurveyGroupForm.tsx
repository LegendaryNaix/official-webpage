'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useDate } from '@/hooks/useDate'
import fetcher from '@/lib/fetcher'
import { SurveyGroupSchema } from '@/lib/forms'
import type { SurveyGroupListItem } from '@/lib/types/survey'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, type Dispatch, type SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function UpdateSurveyGroupForm({
  surveyGroup,
  open,
  setOpen
}: {
  surveyGroup: SurveyGroupListItem
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const router = useRouter()

  const [isFetching, setIsFetching] = useState(false)

  const { parseUTCDate, formatDate, createLocalDate, toUTCString } = useDate()

  const UpdateSurveyGroupFormSchema = SurveyGroupSchema.omit({
    required: true
  })

  const form = useForm<z.infer<typeof UpdateSurveyGroupFormSchema>>({
    resolver: zodResolver(UpdateSurveyGroupFormSchema),
    defaultValues: {
      id: surveyGroup.id,
      name: surveyGroup.name,
      startedAtDate: new Date(surveyGroup.startedAt),
      startedAtTime: formatDate(parseUTCDate(surveyGroup.startedAt), 'HH:mm'),
      endedAtDate: new Date(surveyGroup.endedAt),
      endedAtTime: formatDate(parseUTCDate(surveyGroup.endedAt), 'HH:mm')
    }
  })

  useEffect(() => {
    form.reset({
      id: surveyGroup.id,
      name: surveyGroup.name,
      startedAtDate: new Date(surveyGroup.startedAt),
      startedAtTime: formatDate(parseUTCDate(surveyGroup.startedAt), 'HH:mm'),
      endedAtDate: new Date(surveyGroup.endedAt),
      endedAtTime: formatDate(parseUTCDate(surveyGroup.endedAt), 'HH:mm')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onSubmit = async (
    formData: z.infer<typeof UpdateSurveyGroupFormSchema>
  ) => {
    setIsFetching(true)

    const data = {
      startedAt: toUTCString(
        createLocalDate(
          `${formData.startedAtDate.getFullYear()}-${formData.startedAtDate.getMonth() + 1}-${formData.startedAtDate.getDate()}` +
            ' ' +
            formData.startedAtTime,
          'YYYY-MM-DD HH:mm'
        )
      ),
      endedAt: toUTCString(
        createLocalDate(
          `${formData.endedAtDate.getFullYear()}-${formData.endedAtDate.getMonth() + 1}-${formData.endedAtDate.getDate()}` +
            ' ' +
            formData.endedAtTime,
          'YYYY-MM-DD HH:mm'
        )
      )
    }

    try {
      await fetcher.put(`/surveys/groups/${formData.id}`, data, false)

      setOpen(false)
      toast.success('출석조사 정보가 변경되었습니다')
      router.refresh()
    } catch (error) {
      toast.error('출석조사 정보를 변경하지 못했습니다')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DrawerHeader>
                <DrawerTitle>출석조사 수정</DrawerTitle>
                <DrawerDescription>
                  출석조사 정보를 수정합니다
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col space-y-3 p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>출석조사명</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-x-2">
                  <FormField
                    control={form.control}
                    name="startedAtDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>출석조사 시작</FormLabel>
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
                    name="startedAtTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>출석조사 마감</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <FormField
                    control={form.control}
                    name="endedAtDate"
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
                    name="endedAtTime"
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
              <DrawerFooter>
                <Button type="submit" className="w-full" disabled={isFetching}>
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
