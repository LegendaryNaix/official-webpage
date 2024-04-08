import Pagination from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { getUncheckedAttendances } from '@/lib/actions'
import { AttendanceStatus } from '@/lib/enums'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import Link from 'next/link'
import ScheduleCard from '../_components/ScheduleCard'
import AttendanceCheckListTable from './_components/AttendanceCheckListTable'
import AttendanceTypeTab from './_components/AttendanceTypeTab'

export default async function AttendanceCheckPage({
  params,
  searchParams
}: {
  params: {
    id: number
  }
  searchParams: {
    response?: AttendanceStatus
    page?: string
  }
}) {
  const response = searchParams?.response || AttendanceStatus.Present
  const currentPage = Number(searchParams?.page) || 1

  const attendanceList = await getUncheckedAttendances(
    params.id,
    currentPage,
    response,
    PAGINATION_LIMIT_DEFAULT
  )

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center space-y-3">
      <div className="mt-4 w-full px-4 text-left sm:px-6">
        <h1 className="text-xl font-bold">출석 체크</h1>
      </div>
      <ScheduleCard params={params} />
      <p className="text-sm font-semibold text-amber-400">
        남은 인원: {attendanceList.total}명
      </p>
      <AttendanceTypeTab />
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <AttendanceCheckListTable attendances={attendanceList.attendances} />
      </div>
      <Pagination
        totalPages={calculateTotalPages(
          attendanceList.total,
          PAGINATION_LIMIT_DEFAULT
        )}
      />
      <Link href={`/console/schedule/${params.id}`} className="w-full">
        <Button className="w-full">뒤로가기</Button>
      </Link>
    </main>
  )
}
