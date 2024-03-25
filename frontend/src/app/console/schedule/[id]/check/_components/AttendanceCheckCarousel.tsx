'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import fetcher from '@/lib/fetcher'
import type { AttendanceList, AttendanceListItem } from '@/lib/types/attendance'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import AttendanceCheckCard from './AttendanceCheckCard'

export default function AttendanceCheckCarousel({
  params
}: {
  params: {
    id: number
  }
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [attendances, setAttendances] = useState<AttendanceListItem[]>([])
  const [isFethcing, setIsFetching] = useState(false)
  const PAGINATION_LIMIT = 5

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })

    fetchAttendance()
    setPage(page + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  const handleNextClick = async () => {
    api.scrollNext()
    const currentIdx = (api.selectedScrollSnap() + 1) as number
    if (
      currentIdx % PAGINATION_LIMIT === 0 &&
      Math.floor(currentIdx / PAGINATION_LIMIT) === page
    ) {
      setPage(page + 1)
      await fetchAttendance()
    }
  }

  const fetchAttendance = async () => {
    setIsFetching(true)

    try {
      const attendanceList = await fetcher.get<AttendanceList>(
        `/attendances/unchecked?scheduleId=${params.id}&page=${page + 1}&limit=${PAGINATION_LIMIT}`,
        false
      )

      setCount(attendanceList.total)
      setAttendances([...attendances, ...attendanceList.attendances])
    } catch (error) {
      toast.error('출석정보를 불러오지 못했습니다')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{
          loop: true
        }}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {attendances.map((item) => (
            <CarouselItem key={item.id}>
              <AttendanceCheckCard attendance={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext disabled={isFethcing} onClick={() => handleNextClick()} />
      </Carousel>
      <div className="text-muted-foreground py-2 text-center text-sm">
        전체 {count}개 중 {current}번째
      </div>
    </div>
  )
}
