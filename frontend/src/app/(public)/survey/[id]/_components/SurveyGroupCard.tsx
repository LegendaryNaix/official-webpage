import Badge, { BadgeColor } from '@/components/Badge'
import LocalTime from '@/components/Localtime'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { SurveyGroupListItem } from '@/lib/types/survey'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default async function SurveyGroupCard({
  surveyGroup
}: {
  surveyGroup: SurveyGroupListItem
}) {
  const router = useRouter()

  if (new Date(surveyGroup.endedAt) >= new Date()) {
    toast.error('마감된 출석조사입니다')
    router.push('/survey')
  }

  const renderSurveyStatus = (surveyGroup: SurveyGroupListItem) => {
    const now = new Date()
    if (now > new Date(surveyGroup.endedAt)) {
      return <Badge color={BadgeColor.red} content="마감됨" />
    }
    if (
      now >= new Date(surveyGroup.startedAt) &&
      now <= new Date(surveyGroup.endedAt)
    ) {
      return <Badge color={BadgeColor.green} content="진행중" />
    }

    return <Badge color={BadgeColor.indigo} content="시작전" />
  }

  return (
    <Card
      key={surveyGroup.id}
      className="col-span-12 w-full sm:col-span-6 lg:col-span-4"
    >
      <CardHeader className="font-bold">
        <div className="flex items-center">
          <PencilSquareIcon className="mr-1.5 h-4 w-4" />
          <h2 className="pr-3">{surveyGroup.name}</h2>{' '}
          {renderSurveyStatus(surveyGroup)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col text-xs sm:text-sm">
          <p>
            시작:{' '}
            <LocalTime
              utc={surveyGroup.startedAt}
              format="YYYY-MM-DD ddd HH:mm"
            />
          </p>
          <p>
            마감:{' '}
            <LocalTime
              utc={surveyGroup.endedAt}
              format="YYYY-MM-DD ddd HH:mm"
            />
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
