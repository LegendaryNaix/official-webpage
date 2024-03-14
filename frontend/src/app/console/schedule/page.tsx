import Pagination from '@/components/Pagination'
import { getSchedules } from '@/lib/actions'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import AttendanceListTable from './_components/ScheduleListTable'

export default async function AttendancePage({
  searchParams
}: {
  searchParams?: {
    page?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1
  const scheduleList = await getSchedules(currentPage)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 w-full px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">출결관리</h1>
      </div>
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <AttendanceListTable schedules={scheduleList.schedules} />
        <Pagination
          totalPages={calculateTotalPages(
            scheduleList.total,
            PAGINATION_LIMIT_DEFAULT
          )}
        />
      </div>
    </main>
  )
}
