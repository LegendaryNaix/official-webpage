import Search from '@/components/Search'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import AttendanceListTableSection from './_components/AttendanceListTableSection'
import AttendanceRosterTypeTab from './_components/AttendanceRosterTypeTab'
import AttendanceStatisticSection from './_components/AttendanceStatisticSection'
import DownloadExcelButton from './_components/DownloadExcelButton'
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
  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full flex-col items-center px-4 sm:px-6">
        <div className="mt-4 flex w-full flex-col items-start justify-between space-y-3 text-left sm:flex-row sm:items-center">
          <h1 className="text-lg font-bold sm:text-xl">출결상세</h1>
          <div className="flex items-center space-x-1.5">
            <Link href={`/console/schedule/${params.id}/check`}>
              <Button>출석체크</Button>
            </Link>
            <DownloadExcelButton scheduleId={params.id} />
            <Link href="/console/schedule">
              <Button variant="outline">목록으로</Button>
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-grow flex-col gap-10 py-4">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 flex flex-col space-y-3 lg:col-span-4">
              <h2 className="text-base font-bold">일정</h2>
              <ScheduleCard params={params} />
            </div>
            <div className="col-span-12 flex flex-col space-y-3 lg:col-span-8">
              <h2 className="text-base font-bold">포지션별 출석 통계</h2>
              <AttendanceStatisticSection params={params} />
            </div>
          </div>
          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-12 lg:col-span-6">
              <AttendanceRosterTypeTab />
            </div>
            <div className="col-span-6 flex items-center space-x-2 lg:col-span-6">
              <SearchIcon className="h-6 w-6" />
              <Search placeholder="이름 또는 포지션 검색" />
            </div>
            <div className="col-span-12 flex flex-col space-y-5">
              <AttendanceListTableSection
                params={params}
                searchParams={searchParams}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
