import Pagination from '@/components/Pagination'
import { getRosters } from '@/lib/actions'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import RosterListTable from './_components/RosterListTable'

export default async function RosterPage({
  searchParams
}: {
  searchParams?: {
    page?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1
  const rosterList = await getRosters(currentPage)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center">
      <div className="mt-4 w-full px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">부원명단</h1>
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
    </main>
  )
}
