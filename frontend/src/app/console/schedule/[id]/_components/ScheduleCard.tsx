import Badge, { BadgeColor } from '@/components/Badge'
import LocalTime from '@/components/Localtime'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getSchedule } from '@/lib/actions'
import { ScheduleType } from '@/lib/enums'
import type { ScheduleListItem } from '@/lib/types/schedule'
import { CalendarIcon } from '@heroicons/react/24/outline'

export default async function ScheduleCard({
  params
}: {
  params: { id: number }
}) {
  const schedule = await getSchedule(params.id)

  const renderScheduleType = (schedule: ScheduleListItem) => {
    switch (schedule.type) {
      case ScheduleType.IntegratedExercise:
        return <Badge color={BadgeColor.indigo} content="통합훈련" />
      case ScheduleType.SeperatedExercise:
        return <Badge color={BadgeColor.pink} content="캠퍼스별훈련" />
      case ScheduleType.Game:
        return <Badge color={BadgeColor.green} content="시합" />
      case ScheduleType.Event:
      default:
        return <Badge color={BadgeColor.gray} content="행사" />
    }
  }

  return (
    <Card
      key={schedule.id}
      className="col-span-12 w-full sm:col-span-6 lg:col-span-4"
    >
      <CardHeader className="font-bold">
        <div className="flex items-center">
          <CalendarIcon className="mr-1.5 h-4 w-4" />
          <h2 className="pr-3">{schedule.name}</h2>{' '}
          {renderScheduleType(schedule)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col text-xs sm:text-sm">
          <p>
            시작:{' '}
            <LocalTime utc={schedule.startedAt} format="YYYY-MM-DD ddd HH:mm" />
          </p>
          <p>
            종료:{' '}
            <LocalTime utc={schedule.endedAt} format="YYYY-MM-DD ddd HH:mm" />
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
