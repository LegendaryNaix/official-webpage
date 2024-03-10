import Pagination from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { getSurveyGroups } from '@/lib/actions'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import Link from 'next/link'
import SurveyGroupListTable from './_components/SurveyGroupListTable'

export default async function SurveyPage({
  searchParams
}: {
  searchParams?: {
    page?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1
  const surveyGroupList = await getSurveyGroups(currentPage)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full items-center justify-between px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">출석조사 목록</h1>
        <Link href="/console/survey/new">
          <Button variant="outline">출석조사 생성</Button>
        </Link>
      </div>
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <SurveyGroupListTable surveyGroups={surveyGroupList.surveyGroups} />
        <Pagination
          totalPages={calculateTotalPages(
            surveyGroupList.total,
            PAGINATION_LIMIT_DEFAULT
          )}
        />
      </div>
    </main>
  )
}
