import { Button } from '@/components/ui/button'
import { getSurveyUnsubmits } from '@/lib/actions'
import Link from 'next/link'
import SurveyUnsubmitListTable from './_components/SurveyUnsubmitListTable'

export default async function SurveyUnsubmitPage({
  params
}: {
  params: {
    id: number
  }
}) {
  const surveyUnsubmitList = await getSurveyUnsubmits(params.id)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full items-center justify-between px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">미응답자 명단</h1>
        <Link href="/console/survey">
          <Button variant="outline">목록으로</Button>
        </Link>
      </div>
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <SurveyUnsubmitListTable rosters={surveyUnsubmitList.rosters} />
      </div>
    </main>
  )
}
