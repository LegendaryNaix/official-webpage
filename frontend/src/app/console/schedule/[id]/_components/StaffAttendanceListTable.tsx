import { getAttendances } from '@/lib/actions'
import { RosterType } from '@/lib/enums'
import AttendanceListTable from './AttendanceListTable'

export default async function StaffAttendanceListTable({
  params
}: {
  params: { id: number }
}) {
  const attendanceList = await getAttendances(
    params.id,
    1,
    RosterType.Staff,
    '',
    30
  )

  return <AttendanceListTable attendances={attendanceList.attendances} />
}
