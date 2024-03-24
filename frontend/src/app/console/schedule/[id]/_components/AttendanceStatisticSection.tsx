import { getAttendanceStatistic } from '@/lib/actions'
import AttendanceStatisticTable from './AttendanceStatisticTable'

export default async function AttendanceStatisticSection({
  params
}: {
  params: {
    id: number
  }
}) {
  const statistic = await getAttendanceStatistic(params.id)

  return <AttendanceStatisticTable {...statistic} />
}
