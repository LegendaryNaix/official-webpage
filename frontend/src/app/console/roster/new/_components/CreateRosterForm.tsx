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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select'
import { RosterStatus, RosterType } from '@/lib/enums'
import fetcher from '@/lib/fetcher'
import { RosterFormSchema } from '@/lib/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectValue } from '@radix-ui/react-select'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function CreateRosterForm() {
  const router = useRouter()

  const [isFetching, setIsFetching] = useState(false)

  const CreateRosterFormSchema = RosterFormSchema.omit({ id: true })

  const form = useForm<z.infer<typeof CreateRosterFormSchema>>({
    resolver: zodResolver(CreateRosterFormSchema),
    defaultValues: {
      name: '',
      studentId: '',
      type: RosterType.Athlete,
      status: RosterStatus.Enable,
      class: '',
      target: true
    }
  })

  const onSubmit = async (data: z.infer<typeof CreateRosterFormSchema>) => {
    setIsFetching(true)

    try {
      await fetcher.post('/rosters', {
        ...data,
        class: data.class === '' ? '없음' : data.class
      })
      router.push('/console/roster?revalidate=true')
      toast.success('부원을 등록했습니다')
    } catch (error) {
      toast.error('부원을 등록하지 못했습니다')
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
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="name"
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
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>학번 (코치진의 경우 전화번호 뒤 4자리)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="10자리 (ex 2024310000)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>구분</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="로스터 종류를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={RosterType.Athlete}>선수</SelectItem>
                    <SelectItem value={RosterType.Staff}>스태프</SelectItem>
                    <SelectItem value={RosterType.HeadCoach}>감독</SelectItem>
                    <SelectItem value={RosterType.Coach}>코치</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
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
                      <SelectValue placeholder="부원의 상태를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={RosterStatus.Enable}>활성</SelectItem>
                    <SelectItem value={RosterStatus.Absence}>휴학</SelectItem>
                    <SelectItem value={RosterStatus.Military}>군대</SelectItem>
                    <SelectItem value={RosterStatus.Alumni}>졸업</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="registerYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>입부년도 (미식축구부에 입부한 년도)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="4자리 (ex 2024)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="admissionYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>입학년도 (학교에 입학한 년도)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="4자리 (ex 2024)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>직책 (선택)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(ex 주장, 주무)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.getValues('type') === RosterType.Athlete && (
          <>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="offPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>오펜스포지션</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="defPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>디펜스포지션</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="splPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스페셜포지션</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
        <div className="col-span-12 flex space-x-1">
          <Button type="submit" disabled={isFetching}>
            생성하기
          </Button>
          <Button
            type="button"
            variant={'outline'}
            onClick={() => router.back()}
          >
            목록으로
          </Button>
        </div>
      </form>
    </Form>
  )
}
