import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ScheduleCard from '../_components/ScheduleCard'
import AttendanceCheckCarousel from './_components/AttendanceCheckCarousel'

export default function AttendanceCheckPage({
  params
}: {
  params: {
    id: number
  }
}) {
  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center">
      <div className="mt-4 flex w-full max-w-sm flex-col items-center space-y-5 px-4 sm:px-6">
        <h1 className="text-xl font-bold">출석 체크</h1>
        <ScheduleCard params={params} />
        <AttendanceCheckCarousel params={params} />
        <Link href="/console/schedule/1" className="w-full">
          <Button className="w-full">뒤로가기</Button>
        </Link>
      </div>
    </main>
  )
}
