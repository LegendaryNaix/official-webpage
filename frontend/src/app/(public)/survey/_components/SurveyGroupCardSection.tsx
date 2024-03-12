import Badge, { BadgeColor } from '@/components/Badge'
import LocalTime from '@/components/Localtime'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getSurveyGroups } from '@/lib/actions'
import type { SurveyGroupListItem } from '@/lib/types/survey'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default async function SurveyGroupCardSection() {
  const { surveyGroups } = await getSurveyGroups(1)

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
    <>
      <h1 className="text-xl font-bold">출석조사 목록</h1>
      <div className="grid w-full grid-cols-12 gap-5">
        {surveyGroups.map((surveyGroup) => {
          return (
            <Card
              key={surveyGroup.id}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
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
                      format="YYYY-MM-DD A HH:mm"
                    />
                  </p>
                  <p>
                    마감:{' '}
                    <LocalTime
                      utc={surveyGroup.endedAt}
                      format="YYYY-MM-DD A HH:mm"
                    />
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/survey/${surveyGroup.id}`}>
                  <Button
                    disabled={
                      new Date() <= new Date(surveyGroup.startedAt) ||
                      new Date() >= new Date(surveyGroup.endedAt)
                    }
                    size="sm"
                  >
                    제출하러가기
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  )
}
