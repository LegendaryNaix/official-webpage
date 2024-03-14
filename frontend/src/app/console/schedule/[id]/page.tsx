import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import { Button } from '@/components/ui/button'
import { getAttendances } from '@/lib/actions'
import { RosterType } from '@/lib/enums'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import Link from 'next/link'
import AthleteAttendanceListTable from './_components/AthleteAttendanceListTable'
import ScheduleCard from './_components/ScheduleCard'

export default async function AttendanceStatisticPage({
  params,
  searchParams
}: {
  params: {
    id: number
  }
  searchParams: {
    searchTerm?: string
    page?: string
  }
}) {
  const searchTerm = searchParams?.searchTerm || ''
  const currentPage = Number(searchParams?.page) || 1

  const attendanceList = await getAttendances(
    params.id,
    currentPage,
    RosterType.Athlete,
    searchTerm
  )

  console.log(attendanceList)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full items-center justify-between px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">출결상세</h1>
        <Link href="/console/schedule">
          <Button>목록으로</Button>
        </Link>
      </div>
      <div className="flex w-full flex-grow flex-col gap-10 py-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-5">
          <div className="col-span-12 flex flex-col space-y-3 sm:col-span-3">
            <h2 className="text-base font-bold">일정</h2>
            <ScheduleCard params={params} />
          </div>
          <div className="col-span-12 flex flex-col space-y-3 sm:col-span-9">
            <h2 className="text-base font-bold">포지션별 출석 통계</h2>
            <p className="text-amber-400">준비중입니다</p>
          </div>
        </div>
        <div className="grid grid-cols-12 items-center gap-3">
          <div className="col-span-6 sm:col-span-1">
            <h2 className="text-base font-bold">선수단</h2>
          </div>
          <div className="col-span-6 sm:col-span-2">
            <Search placeholder="포지션 검색..." />
          </div>
          <div className="col-span-12 flex flex-col space-y-5">
            <AthleteAttendanceListTable
              attendances={attendanceList.attendances}
            />
            <Pagination
              totalPages={calculateTotalPages(
                attendanceList.total,
                PAGINATION_LIMIT_DEFAULT
              )}
            />
          </div>
        </div>
        {/* <div>
          <h2 className="text-base font-bold">스태프</h2>
        </div>
        <div>
          <h2 className="text-base font-bold">코치진</h2>
        </div> */}
      </div>
    </main>
  )
}
