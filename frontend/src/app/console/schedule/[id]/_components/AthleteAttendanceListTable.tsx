import Pagination from '@/components/Pagination'
import { getAttendances } from '@/lib/actions'
import { RosterType } from '@/lib/enums'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import AttendanceListTable from './AttendanceListTable'

export default async function AthleteAttendanceListTable({
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

  return (
    <>
      <AttendanceListTable attendances={attendanceList.attendances} />
      <Pagination
        totalPages={calculateTotalPages(
          attendanceList.total,
          PAGINATION_LIMIT_DEFAULT
        )}
      />
    </>
  )
}
