import Pagination from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { getRosters } from '@/lib/actions'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import Link from 'next/link'
import RosterListTable from './RosterListTable'

export default async function RosterSection({
  searchParams
}: {
  searchParams?: {
    page?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1
  const rosterList = await getRosters(currentPage)

  return (
    <section className="w-full">
      <div className="mt-4 flex w-full items-center justify-between px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">부원명단</h1>
        <Link href="/console/roster/new">
          <Button variant="outline">부원 생성하기</Button>
        </Link>
      </div>
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <RosterListTable rosters={rosterList.rosters} />
        <Pagination
          totalPages={calculateTotalPages(
            rosterList.total,
            PAGINATION_LIMIT_DEFAULT
          )}
        />
      </div>
    </section>
  )
}
