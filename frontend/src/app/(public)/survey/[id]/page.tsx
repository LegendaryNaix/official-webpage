import { Button } from '@/components/ui/button'
import { getIsEndedSurvey, getSurveyGroup } from '@/lib/actions'
import type { Metadata } from 'next'
import Link from 'next/link'
import StudentIdForm from './_components/StudentIdForm'
import SubmitSurveySection from './_components/SubmitSurveySection'
import SurveyGroupCardSection from './_components/SurveyGroupCardSection'

export async function generateMetadata({
  params
}: {
  params: { id: number }
}): Promise<Metadata> {
  const surveyGroup = await getSurveyGroup(params.id)

  return {
    title: `${surveyGroup.name}`,
    description: '성균관대학교 미식축구부 로얄스 홈페이지',
    openGraph: {
      images: ['/survey-og.png']
    }
  }
}

export default async function SubmitSurvey({
  params,
  searchParams
}: {
  params: { id: number }
  searchParams?: {
    studentId?: string
  }
}) {
  const { ended: isEnded } = await getIsEndedSurvey(params.id)

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center p-6 lg:px-8">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-y-10">
        {isEnded ? (
          <>
            <p className="text-xl font-bold">마감된 출석조사 입니다</p>
            <Link href="/survey">
              <Button size={'sm'}>목록으로</Button>
            </Link>
          </>
        ) : (
          <>
            <SurveyGroupCardSection params={params} />
            {searchParams?.studentId ? (
              <div className="flex w-full flex-col space-y-3">
                <SubmitSurveySection
                  params={params}
                  searchParams={searchParams}
                />
              </div>
            ) : (
              <StudentIdForm />
            )}
          </>
        )}
      </div>
    </main>
  )
}
